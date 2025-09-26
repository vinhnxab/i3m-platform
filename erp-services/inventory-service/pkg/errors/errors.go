package errors

import "errors"

// Common application errors
var (
	ErrNotFound      = errors.New("resource not found")
	ErrAlreadyExists = errors.New("resource already exists")
	ErrInvalidInput  = errors.New("invalid input")
	ErrUnauthorized  = errors.New("unauthorized")
	ErrForbidden     = errors.New("forbidden")
	ErrInternalError = errors.New("internal server error")
	ErrBadRequest    = errors.New("bad request")
	ErrConflict      = errors.New("conflict")

	// Inventory specific errors
	ErrInsufficientStock = errors.New("insufficient stock")
	ErrInvalidQuantity   = errors.New("invalid quantity")
	ErrProductNotFound   = errors.New("product not found")
	ErrWarehouseNotFound = errors.New("warehouse not found")
	ErrLocationNotFound  = errors.New("location not found")
	ErrSupplierNotFound  = errors.New("supplier not found")

	// Stock movement errors
	ErrInvalidMovement      = errors.New("invalid stock movement")
	ErrMovementNotFound     = errors.New("stock movement not found")
	ErrCannotCancelMovement = errors.New("cannot cancel stock movement")

	// Purchase order errors
	ErrPurchaseOrderNotFound = errors.New("purchase order not found")
	ErrCannotModifyPO        = errors.New("cannot modify purchase order")
	ErrPOAlreadyReceived     = errors.New("purchase order already received")

	// Transfer errors
	ErrTransferNotFound      = errors.New("stock transfer not found")
	ErrCannotModifyTransfer  = errors.New("cannot modify stock transfer")
	ErrSameWarehouseTransfer = errors.New("cannot transfer to same warehouse")

	// Adjustment errors
	ErrAdjustmentNotFound     = errors.New("stock adjustment not found")
	ErrCannotModifyAdjustment = errors.New("cannot modify stock adjustment")
)
