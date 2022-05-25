/* eslint-disable prettier/prettier */
import { HttpRequest, HttpQueue, HttpResponse } from "@rbxts/http-queue";
import { HttpService } from "@rbxts/services";
import { canLoadRequestTypes, checkUserBanTypes, endServerType, getWorkspaceInfoTypes, playerJoinTypes, playerLeaveTypes, startServerTypes } from "types";

type HttpJSONResponse<ExpectedResponse> = HttpResponse & {
    Data: ExpectedResponse
}

export async function InitateAPI(loaderId: string, staging: boolean) {
    const suffix = `?loaderId=${loaderId}&gameId=${game.GameId}&placeId=${game.PlaceId}&jobId=${game.JobId}`;
    const url = staging ? `https://devapi.readmin.dev` : `https://api.readmin.app`;
    let serverId = '';

    async function request(path: string, method: "GET" | "POST" | "PUT" | "DELETE", headers: any, body: any): Promise<any> {
        const request = new HttpRequest(`${url}/games${path}${suffix}${serverId !== undefined && `&id=${serverId}`}`, method, headers, body);
        const response = request.AwaitSend()
        const parsedbody = JSONDecode(response.Body);
        return { ...response, Data: parsedbody };
    }

    return {
        setServerId: async (id: string): Promise<void> => {
            serverId = id;
        },
        canLoadRequest: async function (): Promise<HttpJSONResponse<canLoadRequestTypes>> {
            return await request('/canLoad', "GET", {}, {})
        },
        getWorkspaceInfo: async function (): Promise<HttpJSONResponse<getWorkspaceInfoTypes>> {
            return await request('/', "GET", {}, {})
        },
        startServer: async function (): Promise<HttpJSONResponse<startServerTypes>> {
            return await request('/activity', "POST", {
                "Content-Type": "application/json"
            }, JSONEncode({
                queue: [{
                    name: "serverStart",
                    data: {}
                }]
            }));
        },
        checkUserBan: async function (userId: number): Promise<HttpJSONResponse<checkUserBanTypes>> {
            return await request(`/banned/${userId}`, "GET", {}, {})
        },
        playerJoin: async function (userId: number): Promise<HttpJSONResponse<playerJoinTypes>> {

            return await request(`/activity/users/${userId}`, "POST", {}, {})
        },
        playerLeave: async function (userId: number, playerData: any): Promise<HttpJSONResponse<playerLeaveTypes>> {
            return await request(`/activity/users/${userId}`, "DELETE", {
                "Content-Type": "application/json"
            }, JSONEncode({
                userSessionEvents: playerData
            }))
        },
        endServer: async function (): Promise<HttpJSONResponse<endServerType>> {

            return await request(`/games/activity`, "DELETE", {}, {})
        },
    }
}


function JSONEncode(data: any): any {
    return HttpService.JSONEncode(data);
}

function JSONDecode(data: string): any {
    return HttpService.JSONDecode(data);
}