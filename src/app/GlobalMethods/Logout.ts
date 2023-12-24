import { Router } from "@angular/router";

export function Logout(router: Router):void {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId"); 
}
