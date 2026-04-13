namespace IMS.Core.DTOs;

public record WarehouseDto(
    int Id,
    string Name,
    string? Code,
    string? Address,
    string? ContactPerson,
    string? Phone,
    bool IsActive,
    DateTime CreatedAt
);

public record CreateWarehouseRequest(
    string Name,
    string? Code,
    string? Address,
    string? ContactPerson,
    string? Phone
);

public record UpdateWarehouseRequest(
    string? Name,
    string? Code,
    string? Address,
    string? ContactPerson,
    string? Phone,
    bool? IsActive
);

