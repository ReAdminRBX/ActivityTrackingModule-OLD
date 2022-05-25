/* eslint-disable prettier/prettier */

// Can Load GET /games/canLoad
export type canLoadRequestTypes = {
    success: boolean;
    canLoad: boolean;
}

// Get Information GET /games/
export interface getWorkspaceInfoTypes {
    success: boolean;
    center: Center;
}
export interface Center {
    id: number;
    name: string;
    description: string;
    ownerId: number;
    tracking: number[];
    tags: string[];
    isPremium: boolean;
    created: string;
    premium: boolean;
}


// Start tracking game

export interface startServerTypes {
    success: boolean;
    id?: string;
}

// Check user bans

export interface checkUserBanTypes {
    success: boolean;
    banned: boolean;
    extra?: string;
}

// playerJoinTypes

export interface playerJoinTypes {

}

// playerLeaveTypes

export interface playerLeaveTypes {

}

// endServerType

export interface endServerType {

}
