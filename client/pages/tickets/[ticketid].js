import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (order) => console.log(order),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={doRequest} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  /*Next.js gets the route parameters from the filename. So this line:


const { ticketId } = context.query;
Should actually match your filename. If your page file is:
pages/tickets/[ticketid].js
Then your route param will be ticketid (all lowercase) — not ticketId.

 */
  const { ticketid } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketid}`);

  return { ticket: data };
};

export default TicketShow;
