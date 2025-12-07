import React from 'react';

const LiveNewTicketsAlert = ({ newTickets, onTicketClick, onDismissAll }) => {
  if (newTickets.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-blue-600 text-white rounded-lg shadow-lg border-l-4 border-blue-300 animate-pulse">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-100 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">
                  🚨 {newTickets.length} New Ticket{newTickets.length > 1 ? 's' : ''} Available!
                </h3>
              </div>
              <button
                onClick={onDismissAll}
                className="ml-auto text-blue-100 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {newTickets.slice(-3).map(ticket => (
              <div 
                key={ticket.id}
                className="bg-blue-700 rounded p-3 mb-2 cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={() => onTicketClick(ticket)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">#{ticket.ticket_number}</p>
                    <p className="text-blue-100 text-xs truncate">{ticket.title}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        ticket.priority === 'HIGH' ? 'bg-red-500' :
                        ticket.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                        {ticket.priority}
                      </span>
                      <span className="text-blue-100 text-xs">{ticket.created_ago}</span>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-blue-100 text-xs">{ticket.client_name}</p>
                    <button 
                      className="mt-1 bg-white text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTicketClick(ticket);
                      }}
                    >
                      Get Ticket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {newTickets.length > 3 && (
            <p className="text-blue-100 text-xs mt-2 text-center">
              +{newTickets.length - 3} more tickets available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveNewTicketsAlert;
