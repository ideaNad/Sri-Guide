using MediatR;
using Microsoft.AspNetCore.Http;

namespace SriGuide.Application.Trips.Commands;

public record UploadTourImageCommand(Guid TourId, Guid AgencyId, IFormFile File) : IRequest<string>;
