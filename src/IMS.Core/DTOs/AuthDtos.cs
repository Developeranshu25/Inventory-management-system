namespace IMS.Core.DTOs;

public record LoginRequest(string Email, string Password);

public record LoginResponse(string Token, UserDto User);

public record UserDto(
    int Id,
    string Email,
    string FirstName,
    string LastName,
    string Role,
    bool IsActive
);

public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string Role
);

