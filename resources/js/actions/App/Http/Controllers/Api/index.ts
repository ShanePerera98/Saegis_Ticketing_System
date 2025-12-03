import AuthController from './AuthController'
import TicketController from './TicketController'
import NotificationController from './NotificationController'
import TicketTemplateController from './TicketTemplateController'
import CategoryController from './CategoryController'
import ActivityLogController from './ActivityLogController'
import UserController from './UserController'
import TroubleshootController from './TroubleshootController'
const Api = {
    AuthController: Object.assign(AuthController, AuthController),
TicketController: Object.assign(TicketController, TicketController),
NotificationController: Object.assign(NotificationController, NotificationController),
TicketTemplateController: Object.assign(TicketTemplateController, TicketTemplateController),
CategoryController: Object.assign(CategoryController, CategoryController),
ActivityLogController: Object.assign(ActivityLogController, ActivityLogController),
UserController: Object.assign(UserController, UserController),
TroubleshootController: Object.assign(TroubleshootController, TroubleshootController),
}

export default Api