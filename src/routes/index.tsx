import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

import Dashboard from '../pages/Dashboard';
import Room from '../pages/Room';
import RoomEdit from '../pages/RoomEdit';
import RoomEquipments from '../pages/RoomEquipments';
import Equipment from '../pages/Equipment';
import CreateEquipment from '../pages/CreateEquipment';
import CreateMaintenance from '../pages/CreateMaintenance';
import User from '../pages/User';
import UserEdit from '../pages/UserEdit';
import EquipmentMaintenances from '../pages/EquipmentMaintenances';
import EquipmentMaintenanceDetail from '../pages/EquipmentMaintenanceDetail';
import EquipmentEdit from '../pages/EquipmentEdit';
import Maintenance from '../pages/Maintenance';
import MaintenanceEquipment from '../pages/MaintenanceEquipment';
import MaintenanceEdit from '../pages/MaintenanceEdit';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" exact component={SignUp} />
    <Route path="/forgot-password" exact component={ForgotPassword} />
    <Route path="/reset-password" exact component={ResetPassword} />

    <Route path="/dashboard" exact component={Dashboard} isPrivate />
    <Route path="/dashboard/rooms" exact component={Room} isPrivate />
    <Route
      path="/dashboard/room/update/:id"
      exact
      component={RoomEdit}
      isPrivate
    />
    <Route
      path="/dashboard/room/equipments/:id"
      exact
      component={RoomEquipments}
      isPrivate
    />
    <Route
      path="/dashboard/equipment/update/:id"
      exact
      component={EquipmentEdit}
      isPrivate
    />
    <Route
      path="/dashboard/maintenance/update/:id"
      exact
      component={MaintenanceEdit}
      isPrivate
    />
    <Route path="/dashboard/equipments" exact component={Equipment} isPrivate />
    <Route
      path="/dashboard/equipment/create/:id"
      exact
      component={CreateEquipment}
      isPrivate
    />
    <Route
      path="/dashboard/maintenances"
      exact
      component={Maintenance}
      isPrivate
    />
    <Route
      path="/dashboard/maintenance/create/:id"
      exact
      component={CreateMaintenance}
      isPrivate
    />
    <Route
      path="/dashboard/equipment/maintenances/:id"
      exact
      component={EquipmentMaintenances}
      isPrivate
    />
    <Route
      path="/dashboard/equipment/maintenances/details/:id"
      exact
      component={EquipmentMaintenanceDetail}
      isPrivate
    />
    <Route
      path="/dashboard/maintenance/equipment/:id"
      exact
      component={MaintenanceEquipment}
      isPrivate
    />
    <Route path="/dashboard/users" exact component={User} isPrivate />
    <Route
      path="/dashboard/user/update/:id"
      exact
      component={UserEdit}
      isPrivate
    />
  </Switch>
);
export default Routes;
