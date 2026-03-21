using MediatR;
using System;

namespace SriGuide.Application.Trips.Commands;

public record ToggleTourStatusCommand(Guid TourId, Guid AgencyId) : IRequest<bool>;
