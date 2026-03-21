using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SriGuide.Application.Inquiries.Commands;
using SriGuide.Application.Inquiries.Queries;

namespace SriGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InquiryController : ControllerBase
{
    private readonly IMediator _mediator;

    public InquiryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create(CreateInquiryCommand command)
    {
        return await _mediator.Send(command);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<InquiryDto>>> GetAll()
    {
        return await _mediator.Send(new GetInquiriesQuery());
    }
}
