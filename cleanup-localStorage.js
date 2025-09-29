// Manual localStorage cleanup script
// Run this in browser console to clean up old keys

console.log('🧹 Starting localStorage cleanup...');

// List of old keys to remove
const oldKeys = [
    'user_data', 
    'i3m-language', 
    'authRefreshToken', 
    'authUser', 
    'user',
    'token'
];

// Show current keys before cleanup
console.log('📋 Current localStorage keys:');
Object.keys(localStorage).forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`  ${key}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`);
});

// Migrate i3m-language to language if it exists
const oldLanguage = localStorage.getItem('i3m-language');
if (oldLanguage) {
    localStorage.setItem('language', oldLanguage);
    localStorage.removeItem('i3m-language');
    console.log('🔧 Migrated i3m-language to language:', oldLanguage);
}

// Migrate user_data to userData if userData doesn't exist
const oldUserData = localStorage.getItem('user_data');
const currentUserData = localStorage.getItem('userData');

if (oldUserData && !currentUserData) {
    try {
        const parsedUserData = JSON.parse(oldUserData);
        // Convert platformRoles to userGroups if it exists
        if (parsedUserData.platformRoles) {
            parsedUserData.userGroups = parsedUserData.platformRoles;
            delete parsedUserData.platformRoles;
        }
        localStorage.setItem('userData', JSON.stringify(parsedUserData));
        console.log('🔧 Migrated user_data to userData');
    } catch (error) {
        console.error('Error migrating user_data:', error);
    }
}

// Remove old keys
let removedCount = 0;
oldKeys.forEach(key => {
    if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log('🗑️ Removed old key:', key);
        removedCount++;
    }
});

console.log(`✅ Cleanup completed. Removed ${removedCount} old keys.`);

// Show final keys
console.log('📋 Final localStorage keys:');
Object.keys(localStorage).forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`  ${key}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`);
});

console.log('🎉 localStorage cleanup completed!');
