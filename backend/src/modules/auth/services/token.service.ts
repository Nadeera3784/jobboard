import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from "uuid";

import { VerificationToken } from '../schemas/verificationToken.schema';
import { CreateVerificationTokenDto } from "../dtos/create-verification-token.dto";

@Injectable()
export class TokenService {

    constructor(
        @InjectModel(VerificationToken.name) private readonly verificationTokenModel: Model<VerificationToken>
    ) {
    }

    async getByEmail(email: string) {
        return await this.verificationTokenModel.findOne({
            email : email
        });
    } 

    public async create(createVerificationTokenDto: CreateVerificationTokenDto) {
        return await this.verificationTokenModel.create(createVerificationTokenDto);
    }

    async delete(id: string) {
        return await this.verificationTokenModel.findByIdAndDelete(id);
    }

    async generateVerificationToken(email: string) {

        const token = uuidv4();
        const expires = new Date(new Date().getTime() + 3600 * 1000);
        const existingToken = await this.getByEmail(email);

        if (existingToken) {
            await this.delete(existingToken._id);
        }
        
        return await this.create({
            email : email,
            token: token,
            expires: expires
        });
    }
}
