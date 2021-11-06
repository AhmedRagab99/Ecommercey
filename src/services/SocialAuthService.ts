import { types } from "joi";
import mongoose from "mongoose";
import { User } from "../models/user/User";
import UserService, { IUserServices } from "./UserService";
import { Request } from "express";

import passport from "passport";
import { VerifyCallback, Strategy } from "passport-google-oauth2";

import dotenv from "dotenv";
import { ApiError, errorHandler } from "../utils/ApiError";
import { Strategy as facebookStrategy } from "passport-facebook";

export interface IAuthStrateegy {
  googleSetup(accestoken?: string): void;
  facebookSetup(accessToken?: string): void;
}
export default class SocialMediaAuthStrategy implements IAuthStrateegy {
  private userService: IUserServices;

  constructor(userService: IUserServices = new UserService()) {
    dotenv.config();

    this.userService = userService;
  }
  private serialization() {
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user: any, done) {
      done(null, user);
    });
  }

  public facebookSetup(accessToken?: string) {
    dotenv.config();
    passport.use(
      new facebookStrategy(
        {
          clientID: process.env.FACEBOOK_CLIENT_ID as string,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
          callbackURL: "http://localhost:4000/user/facebook/callback",
          profileFields: [
            "id",
            "displayName",
            "name",
            "gender",
            "picture.type(large)",
            "email",
          ],
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: any,
          done: VerifyCallback
        ) => {
          {
            this.loginLogic(
              {
                id: profile.id,
                name: profile.name.givenName + " " + profile.name.familyName,
                email: profile.emails[0].value,
                picture: profile.photos[0].value,
                authToken: accessToken,
              },
              done
            );
          }
        }
      )
    );

    this.serialization();
  }

  public googleSetup(accesstoken?: string) {
    passport.use(
      new Strategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          callbackURL: "http://localhost:4000/user/google/callback",
          passReqToCallback: true,
        },
        async (
          req: Express.Request,
          accessToken: string,
          refreshToken: string,
          profile: any,
          done: VerifyCallback
        ) => {
          this.loginLogic(
            {
              id: profile.id,
              name: profile._json.name,
              email: profile._json.email,
              picture: profile._json.picture,
              authToken: accessToken,
            },
            done
          );
        }
      )
    );
    this.serialization();
  }

  private async loginLogic(
    { id, name, email, picture, authToken }: any,
    done: VerifyCallback
  ) {
    const findUser = await this.userService.findOne({
      oAuthId: id,
    });

    if (findUser) {
      console.log("found user in db ");
      const token = findUser?.generateAuthenticationToken();
      console.log(token);
      return done(null, findUser);
    } else {
      const user = new User(name, email);

      user.photo = picture as string;
      user.oAuthId = id as string;
      user.oAuthToken = authToken as string;

      const result = await this.userService.create(user);
      console.log(result);
      if (result) {
        const token = user.generateAuthenticationToken();
        console.log(token);
        return done(null, result);
      } else {
        return (
          new ApiError("cannot login with google please try again later", 400, {
            body: "cannot login with google please try again later",
          }),
          null
        );
      }
    }
  }
}
