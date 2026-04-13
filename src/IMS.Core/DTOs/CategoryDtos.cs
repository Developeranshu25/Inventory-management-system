namespace IMS.Core.DTOs;

public record CategoryDto(
    int Id,
    string Name,
    string? Description,
    int? ParentCategoryId,
    string? ParentCategoryName,
    int ProductCount,
    DateTime CreatedAt
);

public record CreateCategoryRequest(string Name, string? Description, int? ParentCategoryId);

public record UpdateCategoryRequest(string? Name, string? Description, int? ParentCategoryId);

