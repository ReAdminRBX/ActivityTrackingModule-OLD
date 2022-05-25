/* eslint-disable prettier/prettier */

import { Players } from '@rbxts/services';
import { InitateAPI } from './requestLibrary';

export async function Tracking(RequestService: Awaited<ReturnType<typeof InitateAPI>>) {

    //Get Information
    const workspace = await RequestService.getWorkspaceInfo();
    const tracking = workspace.Data.center?.tracking;

    // Start Tracking
    const resp = await RequestService.startServer();
    if (resp.Data.success && resp.Data.id) {
        RequestService.setServerId(resp.Data.id);
    }

    const userSessionEvents = {} as {
        [key: number]: any
    };

    // Handle join events

    const hookPlayer = async (player: Player) => {
        userSessionEvents[player.UserId] = [{
            ['type']: 'join',
            ['data']: '',
            ['time']: DateTime.now().UnixTimestampMillis
        }];

        await RequestService.playerJoin(player.UserId);
        const isBanned = await RequestService.checkUserBan(player.UserId);
        if (isBanned.Data.banned) {
            player.Kick(`ReAdmin\nYou are banned from this game\n${isBanned.Data.extra}`);
        }

        player.Chatted.Connect(async msg => {
            userSessionEvents[player.UserId].push({
                ['type']: 'message',
                ['data']: msg,
                ['time']: DateTime.now().UnixTimestampMillis
            });

            //@ts-expect-error lul
            script.FindFirstChild('ReAdminClient')?.Parent = player.FindFirstChild('PlayerGui');
        });
    }

    const hookPlayerLeave = async (player: Player) => {
        userSessionEvents[player.UserId].push({
            ['type']: 'leave',
            ['data']: '',
            ['time']: DateTime.now().UnixTimestampMillis
        });
        await RequestService.playerLeave(player.UserId, userSessionEvents[player.UserId]);
        userSessionEvents[player.UserId] = [];
    }

    const serverClose = async () => {
        await RequestService.endServer();
    }

    Players.PlayerAdded.Connect(hookPlayer)
    Players.PlayerRemoving.Connect(hookPlayerLeave)
    game.Close.Connect(serverClose);
    game.BindToClose(serverClose);


}
