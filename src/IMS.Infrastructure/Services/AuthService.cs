using IMS.Core.Entities;
using IMS.Core.DTOs;
using IMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IMS.Infrastructure.Services;

public class AuthService
{
    private readonly ApplicationDbContext _db;
    private readonly IJwtService _jwtService;

    public AuthService(ApplicationDbContext db, IJwtService jwtService)
    {
        _db = db;
        _jwtService = jwtService;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        user.LastLoginAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);
        return new LoginResponse(token, MapToUserDto(user));
    }

    public async Task<UserDto?> RegisterAsync(RegisterRequest request)
    {
        if (await _db.Users.AnyAsync(u => u.Email == request.Email))
            return null;

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Role = request.Role
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return MapToUserDto(user);
    }

    public async Task<User?> GetUserByIdAsync(int id) =>
        await _db.Users.FindAsync(id);

    private static UserDto MapToUserDto(User u) =>
        new(u.Id, u.Email, u.FirstName, u.LastName, u.Role, u.IsActive);
}

public interface IJwtService
{
    string GenerateToken(User user);
}

