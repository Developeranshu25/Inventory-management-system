namespace IMS.Core.DTOs;

public record ProductDto(
    int Id,
    string Name,
    string? Sku,
    string? Barcode,
    int CategoryId,
    string CategoryName,
    int? SupplierId,
    string? SupplierName,
    string Unit,
    decimal CostPrice,
    decimal SellingPrice,
    int MinimumStockLevel,
    string? Description,
    string? ImageUrl,
    string? VariantInfo,
    bool IsActive,
    int TotalStock,
    DateTime CreatedAt
);

public record CreateProductRequest(
    string Name,
    string? Sku,
    string? Barcode,
    int CategoryId,
    int? SupplierId,
    string Unit,
    decimal CostPrice,
    decimal SellingPrice,
    int MinimumStockLevel,
    string? Description,
    string? ImageUrl,
    string? VariantInfo
);

public record UpdateProductRequest(
    string? Name,
    string? Sku,
    string? Barcode,
    int? CategoryId,
    int? SupplierId,
    string? Unit,
    decimal? CostPrice,
    decimal? SellingPrice,
    int? MinimumStockLevel,
    string? Description,
    string? ImageUrl,
    string? VariantInfo,
    bool? IsActive
);

