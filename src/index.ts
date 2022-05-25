/* eslint-disable prettier/prettier */
/*
ReAdmin Activity Tracking 2.0
Authored 5/25/2022 - Matthew W
*/

import { HttpService } from "@rbxts/services";
import { InitateAPI } from "requestLibrary";
import { Tracking } from "tracking";

function checkHttpServiceEnabled() {
    const [success, repsonse] = pcall(function () {
        HttpService.GetAsync("https://www.google.com");
    });
    return success;
}

export async function Start(loaderId: string, vipServersEnabled = false, staging = false) {
    if (checkHttpServiceEnabled()) {
        print("[ReAdmin] Starting");
        const RequestService = await InitateAPI(loaderId, staging);
        const canLoad = await RequestService.canLoadRequest();
        if (canLoad.Data.success && canLoad.Data.canLoad) {
            if (game.PrivateServerId === "") {
                Tracking(RequestService);
            } else {
                if (vipServersEnabled) {
                    Tracking(RequestService);
                } else {
                    print("[ReAdmin] VIP Servers Enabled, not tracking");
                }
            }
        } else {
            print("[ReAdmin] Failed to load, not tracking");
        }
    } else {
        error("[ReAdmin] ReAdmin is not able to start because HttpService is not enabled!");
    }
}
