namespace IMS.Core.DTOs;

public record UpdateUserRequest(
    string? FirstName,
    string? LastName,
    string? Role,
    bool? IsActive,
    string? Password
);
