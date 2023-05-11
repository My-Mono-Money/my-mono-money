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
import { IUpdateSpaceMemberInvitationDto } from '../interfaces/update-space-member-invitation-dto.interface';

interface IInvitationMemberOptions {
  afterSave?: () => Promise<void>;
}

interface IGetSpaceMembersOptions {
  spaceId: string;
  spaceOwnerEmail: string;
}

@Injectable()
export class SpaceService {
  constructor(private connection: Connection) {}

  async saveInvitation(
    { email, space, status }: ICreateSpaceMemberInvitationDto,
    { afterSave }: IInvitationMemberOptions = {},
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

  async updateInvitationStatus(
    { email, space, status }: IUpdateSpaceMemberInvitationDto,
    { afterSave }: IInvitationMemberOptions = {},
  ) {
    try {
      return await this.connection.transaction(async (manager) => {
        const where = { email, space };
        const updatedInvitationMember = manager.update<SpaceMemberInvitation>(
          SpaceMemberInvitation,
          where,
          { status },
        );

        if (afterSave) {
          await afterSave();
        }

        return updatedInvitationMember;
      });
    } catch (e) {
      handleStorageError(e);
    }
  }

  async removeInvitation({ space, memberEmail }) {
    try {
      const invitation = await this.connection
        .getRepository(SpaceMemberInvitation)
        .createQueryBuilder('invitation')
        .leftJoin('invitation.space', 'space')
        .where('invitation.email = :memberEmail', { memberEmail })
        .andWhere('space.id = :spaceId', { spaceId: space.id })
        .getOne();

      if (invitation) {
        await this.connection.manager.remove(invitation);
        return true;
      }
      return false;
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

  async getSpaceMembers({ spaceId, spaceOwnerEmail }: IGetSpaceMembersOptions) {
    try {
      const members = await this.connection.manager.find<SpaceMemberInvitation>(
        SpaceMemberInvitation,
        {
          relations: ['space'],
          where: [
            {
              email: spaceOwnerEmail,
            },
            { space: { id: spaceId } },
          ],
        },
      );
      const userIds = members.map((member) => member.space.id);
      const users = await this.connection
        .getRepository(User)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.ownSpace', 'space')
        .select(['user.email', 'user.firstName', 'user.lastName', 'space.id'])
        .where('user.ownSpace.id IN (:...userIds)', { userIds })
        .getMany();

      const membersWithOwner = members.map((member) => {
        const ownerUser = users.find(
          (user) => user.ownSpace.id === member.space.id,
        );
        return {
          id: member.id,
          email: member.email,
          createAt: member.createdAt,
          updatedAt: member.updatedAt,
          status: member.status,
          owner: {
            email: ownerUser.email,
            firstName: ownerUser.firstName,
            lastName: ownerUser.lastName,
          },
        };
      });
      return membersWithOwner;
    } catch (e) {
      handleStorageError(e);
    }
  }
}
