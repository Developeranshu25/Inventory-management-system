namespace IMS.Core.DTOs;

public record SupplierDto(
    int Id,
    string Name,
    string? Phone,
    string? Email,
    string? Address,
    string? GstTaxId,
    string? ContactPerson,
    bool IsActive,
    DateTime CreatedAt
);

public record CreateSupplierRequest(
    string Name,
    string? Phone,
    string? Email,
    string? Address,
    string? GstTaxId,
    string? ContactPerson
);

public record UpdateSupplierRequest(
    string? Name,
    string? Phone,
    string? Email,
    string? Address,
    string? GstTaxId,
    string? ContactPerson,
    bool? IsActive
);

