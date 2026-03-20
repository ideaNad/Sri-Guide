using MediatR;
using System;

namespace SriGuide.Application.Agencies.Commands;

public record RespondToAgencyOfferCommand(Guid GuideUserId, bool Accept) : IRequest<bool>;
