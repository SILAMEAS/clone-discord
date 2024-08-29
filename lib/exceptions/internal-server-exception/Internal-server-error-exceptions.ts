import {NextResponse} from "next/server";

export const InternalServerErrorExceptions = (message?: string) => {
    return new NextResponse(message??"Internal Error", { status: 500 });
};
