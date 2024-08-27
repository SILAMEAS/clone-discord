import React from 'react';
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";

const SignUp = () => {
    return (
        <SignedOut>
            <SignInButton />
        </SignedOut>
        <div>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    );
};

export default SignUp;
