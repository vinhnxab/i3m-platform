package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/i3m-platform/installation-service/internal/services"
)

type InstallationHandler struct {
	service *services.InstallationService
}

func NewInstallationHandler(service *services.InstallationService) *InstallationHandler {
	return &InstallationHandler{
		service: service,
	}
}

func (h *InstallationHandler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "Template Installation Service",
		"version": "1.0.0",
		"port":    "3061",
	})
}

func (h *InstallationHandler) InstallTemplate(c *gin.Context) {
	var req struct {
		TemplateID string                 `json:"template_id" binding:"required"`
		TenantID   string                 `json:"tenant_id" binding:"required"`
		Config     map[string]interface{} `json:"config"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Implement template installation logic
	installationID := "inst_" + req.TemplateID + "_" + req.TenantID

	c.JSON(http.StatusCreated, gin.H{
		"installation_id": installationID,
		"status":          "installing",
		"message":         "Template installation started",
	})
}

func (h *InstallationHandler) GetInstallationStatus(c *gin.Context) {
	installationID := c.Param("id")

	// TODO: Implement status checking logic
	c.JSON(http.StatusOK, gin.H{
		"installation_id": installationID,
		"status":          "completed",
		"progress":        100,
		"message":         "Installation completed successfully",
	})
}

func (h *InstallationHandler) UninstallTemplate(c *gin.Context) {
	installationID := c.Param("id")

	// TODO: Implement uninstallation logic
	c.JSON(http.StatusOK, gin.H{
		"installation_id": installationID,
		"status":          "uninstalled",
		"message":         "Template uninstalled successfully",
	})
}

func (h *InstallationHandler) ListInstalledTemplates(c *gin.Context) {
	// TODO: Implement listing logic
	c.JSON(http.StatusOK, gin.H{
		"templates": []gin.H{
			{
				"id":           "template_1",
				"name":         "E-commerce Template",
				"version":      "1.0.0",
				"status":       "installed",
				"installed_at": "2024-01-01T00:00:00Z",
			},
		},
	})
}
