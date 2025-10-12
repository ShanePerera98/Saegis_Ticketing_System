import AuthController from './AuthController'
import TicketController from './TicketController'
import TicketTemplateController from './TicketTemplateController'
import CategoryController from './CategoryController'
import ActivityLogController from './ActivityLogController'
import UserController from './UserController'
const Api = {
    AuthController: Object.assign(AuthController, AuthController),
TicketController: Object.assign(TicketController, TicketController),
TicketTemplateController: Object.assign(TicketTemplateController, TicketTemplateController),
CategoryController: Object.assign(CategoryController, CategoryController),
ActivityLogController: Object.assign(ActivityLogController, ActivityLogController),
UserController: Object.assign(UserController, UserController),
}

export default Api