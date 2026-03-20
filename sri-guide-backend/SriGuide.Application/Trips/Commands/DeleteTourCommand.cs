using MediatR;
using System;

namespace SriGuide.Application.Trips.Commands;

public record DeleteTourCommand(Guid TripId, Guid UserId) : IRequest<bool>;
