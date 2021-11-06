import { types } from "joi";
import mongoose from "mongoose";
import { User } from "./../models/user/User";
import UserService, { IUserServices } from "./../services/UserService";
import { Request } from "express";

import passport from "passport";
import { VerifyCallback, Strategy } from "passport-google-oauth2";

import dotenv from "dotenv";
import { ApiError, errorHandler } from "./ApiError";
import { Strategy as facebookStrategy } from "passport-facebook";

export interface IGoogleStrateegy {
  setup(accestoken?: string): void;
  facebookSetup(accessToken?: string): void;
}
export default class GoogleStrategy implements IGoogleStrateegy {
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
            //   if (accessToken == accesstoken) console.log(profile);

            const findUser = await this.userService.findOne({
              oAuthId: profile.id,
            });

            if (findUser) {
              console.log("found user in db ");
              const token = findUser?.generateAuthenticationToken();
              console.log(token);
              return done(null, findUser);
            } else {
              const user = new User(
                profile.name.givenName + " " + profile.name.familyName,
                profile.emails[0].value as string
              );

              user.photo = profile.photos[0].value as string;
              user.oAuthId = profile.id as string;
              user.oAuthToken = accessToken as string;

              const result = await this.userService.create(user);
              console.log(result);
              if (result) {
                const token = user.generateAuthenticationToken();
                console.log(token);
                return done(null, result);
              } else {
                return (
                  new ApiError(
                    "cannot login with google please try again later",
                    400,
                    { body: "cannot login with google please try again later" }
                  ),
                  null
                );
              }
            }
          }
        }
      )
    );
    this.serialization();
  }
  public setup(accesstoken?: string) {
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
          //   if (accessToken == accesstoken) console.log(profile);

          const findUser = await this.userService.findOne({
            oAuthId: profile.id,
          });

          if (findUser) {
            console.log("found user in db ");
            const token = findUser?.generateAuthenticationToken();
            console.log(token);
            return done(null, findUser);
          } else {
            const user = new User(
              profile._json.name as string,
              profile._json.email as string
            );

            user.photo = profile._json.picture as string;
            user.oAuthId = profile.id as string;
            user.oAuthToken = accessToken as string;

            const result = await this.userService.create(user);
            console.log(result);
            if (result) {
              const token = user.generateAuthenticationToken();
              console.log(token);
              return done(null, result);
            } else {
              return (
                new ApiError(
                  "cannot login with google please try again later",
                  400,
                  { body: "cannot login with google please try again later" }
                ),
                null
              );
            }
          }
        }
      )
    );
    this.serialization();
  }
}
