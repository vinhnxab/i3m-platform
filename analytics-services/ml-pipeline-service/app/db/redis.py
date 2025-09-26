"""Redis configuration and connection management."""

import json
from typing import Any, Optional, Union

import structlog
import redis.asyncio as redis
from redis.asyncio import Redis

from app.core.config import settings

logger = structlog.get_logger(__name__)


class RedisClient:
    """Redis client wrapper with connection management."""
    
    def __init__(self):
        self.redis: Optional[Redis] = None
        self._connected = False
    
    async def connect(self) -> None:
        """Connect to Redis."""
        try:
            self.redis = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                max_connections=settings.REDIS_POOL_SIZE,
                retry_on_timeout=True,
            )
            
            # Test connection
            await self.redis.ping()
            self._connected = True
            logger.info("Redis connected successfully", url=settings.REDIS_URL.split("@")[-1])
            
        except Exception as e:
            logger.error("Failed to connect to Redis", error=str(e))
            raise
    
    async def disconnect(self) -> None:
        """Disconnect from Redis."""
        if self.redis:
            try:
                await self.redis.close()
                self._connected = False
                logger.info("Redis disconnected")
            except Exception as e:
                logger.error("Error disconnecting from Redis", error=str(e))
    
    async def ping(self) -> bool:
        """Ping Redis server."""
        if not self.redis:
            return False
        
        try:
            result = await self.redis.ping()
            return result
        except Exception as e:
            logger.error("Redis ping failed", error=str(e))
            return False
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from Redis."""
        if not self.redis:
            return None
        
        try:
            value = await self.redis.get(key)
            if value:
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return value
            return None
        except Exception as e:
            logger.error("Redis get failed", key=key, error=str(e))
            return None
    
    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None
    ) -> bool:
        """Set value in Redis."""
        if not self.redis:
            return False
        
        try:
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            
            if ttl:
                result = await self.redis.setex(key, ttl, value)
            else:
                result = await self.redis.set(key, value)
            
            return bool(result)
        except Exception as e:
            logger.error("Redis set failed", key=key, error=str(e))
            return False
    
    def is_connected(self) -> bool:
        """Check if Redis is connected."""
        return self._connected


# Global Redis client instance
redis_client = RedisClient()


# Cache decorator
def cached(ttl: int = settings.REDIS_CACHE_TTL):
    """Cache decorator for functions."""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Create cache key from function name and arguments
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached_result = await redis_client.get(cache_key)
            if cached_result is not None:
                logger.debug("Cache hit", key=cache_key)
                return cached_result
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            await redis_client.set(cache_key, result, ttl)
            logger.debug("Cache set", key=cache_key, ttl=ttl)
            
            return result
        return wrapper
    return decorator
