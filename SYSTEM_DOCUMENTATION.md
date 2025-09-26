# Help Desk Ticketing Management System

A comprehensive, production-ready Help Desk Ticketing System built with Laravel 11 and React 18, featuring advanced workflows, role-based access control, and comprehensive audit trails.

## 🚀 Features Overview

### Core Functionality
- **Multi-Role Support**: Super Admin, Admin, and Client roles with granular permissions
- **Ticket Lifecycle Management**: Complete workflow from creation to resolution
- **Real-time Updates**: Live status updates and notifications
- **Advanced Search & Filtering**: Powerful search capabilities across all ticket attributes

### Advanced Features
- **Cancellation Workflows**: Handle Irrelevant and Duplicate tickets with approval processes
- **Duplicate Ticket Merging**: Intelligent merging system with rollback capabilities  
- **Dynamic Template System**: Form builder for customizable ticket templates
- **Comprehensive Reporting**: Charts, analytics, and exportable reports
- **Activity Logging**: Complete audit trail for all system actions
- **Soft Delete with Recovery**: Safe deletion with restoration capabilities

### Technical Excellence
- **Laravel 11 Backend**: Modern PHP framework with latest features
- **React 18 Frontend**: Modern SPA with React Query for state management
- **Laravel Sanctum**: Secure SPA authentication
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Database Optimization**: Efficient queries with proper indexing

## 🏗 System Architecture

### Backend (Laravel 11)
- **Models**: 15+ Eloquent models with comprehensive relationships
- **Controllers**: RESTful API controllers with proper validation
- **Services**: Business logic separation with dedicated service classes
- **Policies**: Authorization logic with Laravel policies
- **Middleware**: Custom middleware for role-based access
- **Database**: 20+ migration files with proper foreign keys and indexes

### Frontend (React 18)
- **Components**: 25+ reusable React components
- **Pages**: Dedicated pages for different user roles and workflows  
- **Context API**: Authentication and state management
- **React Query**: Server state management and caching
- **React Router**: Client-side routing with protected routes
- **Charts**: Data visualization with Recharts library

### Database Schema
```
users (authentication, roles, permissions)
├── tickets (core ticketing functionality)
│   ├── ticket_categories (hierarchical categorization)
│   ├── ticket_assignments (assignment management)
│   ├── ticket_collaborators (collaboration features)
│   ├── ticket_comments (communication thread)
│   ├── ticket_attachments (file management)
│   └── ticket_status_transitions (workflow tracking)
├── ticket_templates (dynamic forms)
│   ├── ticket_template_fields (form field definitions)
│   └── ticket_field_values (submitted form data)
├── cancelled_tickets (cancellation workflow)
├── duplicate_merges (duplicate management)
│   └── duplicate_merge_items (merge relationships)
├── deleted_tickets_log (soft delete audit)
└── activity_logs (comprehensive audit trail)
```

## 🔧 Installation & Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm or yarn
- SQLite (development) or MySQL (production)

### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd TicketingManagementSystem

# Install PHP dependencies
composer install

# Install Node.js dependencies  
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations and seeders
php artisan migrate
php artisan db:seed

# Build frontend assets
npm run build

# Start development server
php artisan serve
```

### Creating Initial Users
```bash
# Create Super Admin
php artisan tinker
User::create([
    'name' => 'System Admin',
    'email' => 'admin@example.com', 
    'password' => bcrypt('password123'),
    'role' => 'SUPER_ADMIN'
]);

# Create Admin
User::create([
    'name' => 'Support Admin',
    'email' => 'support@example.com',
    'password' => bcrypt('password123'), 
    'role' => 'ADMIN'
]);

# Create Client
User::create([
    'name' => 'Test Client',
    'email' => 'client@example.com',
    'password' => bcrypt('password123'),
    'role' => 'CLIENT'
]);
```

## 🔐 Role-Based Access Control

### Super Admin
- Full system access
- User management (create, update, delete)
- Admin creation capabilities
- System configuration
- All ticket operations
- Activity monitoring

### Admin
- Ticket management (all tickets)
- Client support operations
- Assignment management
- Reporting and analytics
- Template management
- Cancellation approvals

### Client
- Create and manage own tickets
- View ticket history
- Add comments and attachments
- Request ticket cancellation
- Basic reporting (own tickets)

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/login       # User login
POST   /api/auth/logout      # User logout  
GET    /api/me               # Current user info
```

### Tickets
```
GET    /api/tickets          # List tickets (filtered by role)
POST   /api/tickets          # Create ticket
GET    /api/tickets/{id}     # Get ticket details
PATCH  /api/tickets/{id}     # Update ticket
POST   /api/tickets/{id}/assign    # Assign ticket
POST   /api/tickets/{id}/comments  # Add comment
POST   /api/tickets/{id}/cancel/irrelevant  # Cancel as irrelevant
```

### Advanced Operations  
```
GET    /api/tickets/cancelled      # List cancelled tickets
POST   /api/tickets/cancelled/{id}/approve  # Approve cancellation
GET    /api/tickets/merges         # List duplicate merges
POST   /api/tickets/merge          # Merge duplicate tickets
GET    /api/tickets/reports        # Get reports data
GET    /api/tickets/stats          # Get system statistics
```

### Templates & Configuration
```
GET    /api/ticket-templates       # List templates
POST   /api/ticket-templates       # Create template
GET    /api/categories             # List categories
```

### Activity Logs
```
GET    /api/activity-logs          # List activity logs
GET    /api/activity-logs/stats    # Activity statistics
GET    /api/activity-logs/ticket/{id}  # Ticket-specific logs
```

## 🎯 Usage Guide

### For Clients
1. **Login** to the system with client credentials
2. **Create Tickets** using the intuitive form interface
3. **Track Progress** with real-time status updates
4. **Communicate** via comments and attachments
5. **Cancel Requests** when tickets become irrelevant

### For Admins
1. **Dashboard Overview** shows key metrics and pending items
2. **Ticket Management** with advanced filtering and assignment
3. **Cancellation Center** to approve/reject cancellation requests
4. **Merge Center** to handle duplicate ticket consolidation
5. **Reports** with charts and exportable data
6. **Template Builder** for creating custom ticket forms
7. **Activity Logs** for comprehensive audit trails

### For Super Admins
1. **User Management** including admin creation
2. **System Status** monitoring and health checks
3. **Advanced Configuration** and system settings
4. **Complete Audit Access** to all system activities

## 🔄 Workflows

### Ticket Lifecycle
```
New → In Progress → Pending → Resolved → Closed
                 ↓
            Cancelled (Irrelevant/Duplicate)
```

### Cancellation Workflow
1. Client/Admin requests cancellation (Irrelevant or Duplicate)
2. System creates cancellation record with reason
3. Admin reviews and approves/rejects
4. Approved tickets are soft-deleted after specified period
5. Complete audit trail maintained

### Duplicate Merge Workflow  
1. Admin identifies duplicate tickets
2. Select primary ticket and duplicates to merge
3. System consolidates comments, attachments, and history
4. Merge can be undone if needed
5. All relationships and references updated

## 📈 Reporting & Analytics

### Available Reports
- **Ticket Volume**: Creation trends over time
- **Resolution Times**: Performance metrics
- **Category Distribution**: Popular support topics  
- **Agent Performance**: Assignment and resolution stats
- **Priority Analysis**: Urgency distribution
- **Status Distribution**: Current ticket states

### Export Formats
- CSV for data analysis
- PDF for presentations
- JSON for API integration

## 🔧 Configuration

### Environment Variables
```env
# Database
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite

# Authentication
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000

# File Storage
FILESYSTEM_DISK=local

# Queue Configuration
QUEUE_CONNECTION=database
```

### Customization Options
- **Ticket Statuses**: Configurable via enums
- **Priority Levels**: Customizable priority system
- **Auto-deletion**: Configurable timeframes
- **Email Notifications**: SMTP configuration
- **File Upload**: Size limits and allowed types

## 🧪 Testing

### API Testing Examples
```bash
# Test authentication
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  http://localhost:8000/api/auth/login

# Test ticket creation  
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Ticket","description":"Test Description","priority":"MEDIUM"}' \
  http://localhost:8000/api/tickets

# Test system health
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/tickets/stats
```

### Frontend Testing
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Technical Documentation

### Key Files Structure
```
app/
├── Models/           # Eloquent models
├── Http/Controllers/ # API controllers
├── Services/         # Business logic
├── Policies/         # Authorization  
├── Enums/           # System enums
└── Traits/          # Reusable traits

resources/js/
├── components/      # React components
├── pages/          # Page components
├── contexts/       # React contexts
├── services/       # API services
└── hooks/          # Custom hooks

database/
├── migrations/     # Database schema
├── seeders/       # Sample data
└── factories/     # Model factories
```

### Performance Optimizations
- Database query optimization with eager loading
- React Query for efficient API caching
- Proper database indexing for search performance
- Lazy loading for large components
- Image optimization and compression

### Security Features
- CSRF protection with Sanctum
- SQL injection prevention with Eloquent
- XSS protection with proper escaping
- Role-based authorization at API level
- Input validation and sanitization
- Secure file upload handling

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database optimized and backed up
- [ ] SSL certificate installed
- [ ] Queue workers configured
- [ ] Log rotation configured
- [ ] Monitoring tools setup
- [ ] Performance testing completed

### Docker Deployment (Optional)
```dockerfile
# Example Dockerfile structure
FROM php:8.2-fpm
# Install dependencies, configure PHP, setup Laravel
# Build frontend assets  
# Configure web server
```

## 📞 Support & Maintenance

### Monitoring
- **System Status**: Built-in health check dashboard
- **Activity Logs**: Comprehensive audit trail
- **Performance Metrics**: Response times and throughput
- **Error Tracking**: Centralized error logging

### Backup Strategy
- **Database**: Daily automated backups
- **Files**: Regular file system backups  
- **Code**: Version control with Git
- **Configuration**: Environment backup

### Updates & Maintenance
- Regular security updates for dependencies
- Database optimization and cleanup
- Log file rotation and archival
- Performance monitoring and tuning

## 🤝 Contributing

This is a production-ready system built to enterprise standards. For customizations or enhancements:

1. Follow PSR coding standards
2. Write comprehensive tests
3. Update documentation
4. Use proper Git workflow
5. Maintain security standards

## 📄 License

This project is proprietary software designed for Help Desk Ticketing operations. All rights reserved.

---

**Built with ❤️ using Laravel 11 + React 18**

*A complete, production-ready Help Desk Ticketing Management System with advanced features, comprehensive workflows, and enterprise-grade security.*
