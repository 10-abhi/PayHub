import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import z from "zod"
import { Session, User  } from "next-auth";
import { JWT } from "next-auth/jwt";

const credentialsSchema = z.object({
    phone: z.string().min(10),
    password: z.string().min(6),
});
type sessionType = {
    token : JWT,
    session : Session
}
type jwtTypes = {
    token : JWT,
    user : User
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
                password: { label: "Password", type: "password" }
            },
            // TODO: User credentials type from next-auth //done
            async authorize(credentials?: Record<'phone' | 'password', string>) {
                if (!credentials) throw new Error('No credentials provided');
                // Do zod validation, OTP validation here //done
                const parsedCredentials = credentialsSchema.safeParse(credentials);
                if (!parsedCredentials.success) { throw new Error('Failed to Parse the Credentials') }
                const { phone, password } = parsedCredentials.data;
                const hashedPassword = await bcrypt.hash(password, 10);
                try {
                 const existingUser = await db.user.findFirst({
                    where: {
                        number: phone
                    }
                });

                if (existingUser) {
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                    if (passwordValidation) {
                        console.log("Password Validated")
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            email: existingUser.number
                        }
                    }
                    return null;
                }   
                } catch (error) {
                    console.error(error);   
                }
                

                try {
                    const user = await db.user.create({
                        data: {
                            number: credentials.phone,
                            password: hashedPassword,
                            email: `${credentials.phone}@example.com`
                        }
                    });
                    console.log("User added to the db");
                    const balance = await db.balance.create({
                        data: {
                            amount: 10000,
                            locked: 100,
                            userId: user.id
                        }
                    })
                    console.log("Dummy Balance added to the db" , balance.amount);
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.number
                    }
            
                } catch (e) {
                    console.error(e);
                }

                return null
            },
        })
    ],
    
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
    //     async jwt({ token , user } : jwtTypes) {
    //     // When user signs in, add their ID to the token
    //     if (user) {
    //         token.sub = user.id;
    //     }
    //     return token;
    // },
        // TODO: can u fix the type here? Using any is bad //done
        async session({ token, session }:sessionType) {           
            if(session.user && token ){
             session.user.id = token.sub}
            
            return session
        }
    }
    
}
