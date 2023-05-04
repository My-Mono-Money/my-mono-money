import { Injectable } from '@nestjs/common';
import { Connection, Raw } from 'typeorm';
import {
  ICreateSpaceMemberInvitationDto,
  StatusType,
} from '../interfaces/create-space-member-invitation-dto.interface';
import { SpaceMemberInvitation } from '../entities/space-member-invitation.entity';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { Space } from '../entities/space.entity';
import { User } from '../entities/user.entity';

interface ISaveInvitationMemberOptions {
  afterSave?: () => Promise<void>;
}

@Injectable()
export class SpaceService {
  constructor(private connection: Connection) {}

  async saveInvitation(
    { email, space, status }: ICreateSpaceMemberInvitationDto,
    { afterSave }: ISaveInvitationMemberOptions = {},
  ) {
    try {
      return await this.connection.transaction(async (manager) => {
        const inviteMemberEntity = manager.create<SpaceMemberInvitation>(
          SpaceMemberInvitation,
          {
            email,
            space,
            status,
          },
        );
        const savedInvitationMember = await manager.save(inviteMemberEntity);

        if (afterSave) {
          await afterSave();
        }

        return savedInvitationMember;
      });
    } catch (e) {
      handleStorageError(e);
    }
  }

  async getSpaceListForUserByEmail(email: string) {
    try {
      const selectOwnSpaceIdQuery = this.connection
        .getRepository<User>(User)
        .createQueryBuilder()
        .select(`"own_space_id"`)
        .where(`"email" = :email`);

      const selectSharedSpaceIdsQuery = this.connection
        .getRepository<SpaceMemberInvitation>(SpaceMemberInvitation)
        .createQueryBuilder()
        .select(`"space_id"`)
        .where(`"email" = :email`)
        .andWhere(`"status" = '${StatusType.ACCEPTED}'`);

      return await this.connection.manager.find<Space>(Space, {
        relations: ['owner'],
        where: [
          {
            id: Raw(
              (alias) => `${alias} IN(${selectOwnSpaceIdQuery.getQuery()})`,
              { email },
            ),
          },
          {
            id: Raw(
              (alias) => `${alias} IN(${selectSharedSpaceIdsQuery.getQuery()})`,
              { email },
            ),
          },
        ],
      });
    } catch (e) {
      handleStorageError(e);
    }
  }
}
