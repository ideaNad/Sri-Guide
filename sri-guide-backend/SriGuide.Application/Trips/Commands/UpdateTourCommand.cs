using MediatR;
using System;
using System.Collections.Generic;

namespace SriGuide.Application.Trips.Commands;

public record UpdateTourCommand(
    Guid TripId,
    Guid? AgencyId,
    Guid? GuideId,
    string Title,
    string Description,
    string Location,
    string? Category,
    decimal Price,
    string? MainImageUrl,
    DateTime? Date,
    List<ItineraryStepDto> Itinerary
) : IRequest<bool>;
