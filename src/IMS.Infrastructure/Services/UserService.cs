using IMS.Core.DTOs;
using IMS.Core.Entities;
using IMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IMS.Infrastructure.Services;

public class UserService
{
    private readonly ApplicationDbContext _db;

    public UserService(ApplicationDbContext db) => _db = db;

    public async Task<PagedResult<UserDto>> GetAllAsync(int page = 1, int pageSize = 20, string? search = null)
    {
        var query = _db.Users.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(u => u.Email.Contains(search) || 
                u.FirstName.Contains(search) || u.LastName.Contains(search));

        var total = await query.CountAsync();
        var items = await query
            .OrderBy(u => u.Email)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<UserDto>(
            items.Select(u => new UserDto(u.Id, u.Email, u.FirstName, u.LastName, u.Role, u.IsActive)).ToList(),
            total, page, pageSize);
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _db.Users.FindAsync(id);
        return user == null ? null : new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role, user.IsActive);
    }

    public async Task<UserDto?> UpdateAsync(int id, UpdateUserRequest req)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return null;

        if (req.FirstName != null) user.FirstName = req.FirstName;
        if (req.LastName != null) user.LastName = req.LastName;
        if (req.Role != null) user.Role = req.Role;
        if (req.IsActive.HasValue) user.IsActive = req.IsActive.Value;
        if (!string.IsNullOrEmpty(req.Password))
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);

        await _db.SaveChangesAsync();
        return new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role, user.IsActive);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return false;
        user.IsActive = false;
        await _db.SaveChangesAsync();
        return true;
    }
}
