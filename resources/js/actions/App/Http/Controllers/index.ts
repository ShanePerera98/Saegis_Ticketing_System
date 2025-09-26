import Auth from './Auth'
import Api from './Api'
import SPAController from './SPAController'
import Settings from './Settings'
const Controllers = {
    Auth: Object.assign(Auth, Auth),
Api: Object.assign(Api, Api),
SPAController: Object.assign(SPAController, SPAController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers