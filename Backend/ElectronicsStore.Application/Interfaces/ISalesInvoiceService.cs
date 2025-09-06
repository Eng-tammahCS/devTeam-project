using ElectronicsStore.Application.DTOs;

namespace ElectronicsStore.Application.Interfaces;

public interface ISalesInvoiceService
{
    Task<IEnumerable<SalesInvoiceDto>> GetAllSalesInvoicesAsync();
    Task<SalesInvoiceDto?> GetSalesInvoiceByIdAsync(int id);
    Task<SalesInvoiceDto> CreateSalesInvoiceAsync(CreateSalesInvoiceDto dto, int userId);
    Task DeleteSalesInvoiceAsync(int id);
}
