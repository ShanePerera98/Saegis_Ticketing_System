import SPAController from './SPAController'
import Auth from './Auth'
import Api from './Api'
import Settings from './Settings'
const Controllers = {
    SPAController: Object.assign(SPAController, SPAController),
Auth: Object.assign(Auth, Auth),
Api: Object.assign(Api, Api),
Settings: Object.assign(Settings, Settings),
}

export default Controllers