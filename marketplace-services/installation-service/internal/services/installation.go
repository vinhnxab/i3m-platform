package services

import (
	"github.com/i3m-platform/installation-service/internal/config"
)

type InstallationService struct {
	config *config.Config
}

func NewInstallationService(cfg *config.Config) *InstallationService {
	return &InstallationService{
		config: cfg,
	}
}

// TODO: Implement installation service methods
// - InstallTemplate(templateID, tenantID, config) error
// - UninstallTemplate(installationID) error
// - GetInstallationStatus(installationID) (status, error)
// - ListInstalledTemplates(tenantID) ([]Template, error)
