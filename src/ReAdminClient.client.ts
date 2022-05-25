import { UserInputService, ReplicatedStorage } from "@rbxts/services";

const reAdminFolder = ReplicatedStorage.WaitForChild("ReAdminStorage");
const reAdminFunction = reAdminFolder.WaitForChild("ReAdminFunctions") as RemoteFunction;
const reAdminEvent = reAdminFolder.WaitForChild("ReAdminEvents") as RemoteEvent;

UserInputService.WindowFocused.Connect(function () {
    reAdminEvent.FireServer("Idle", false);
})

UserInputService.WindowFocusReleased.Connect(function () {
    reAdminEvent.FireServer("Idle", true);
})


export { };