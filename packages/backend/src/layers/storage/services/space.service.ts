import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ICreateSpaceMemberInvitationDto } from '../interfaces/create-space-member-invitation-dto.interface';
import { SpaceMemberInvitation } from '../entities/space-member-invitation.entity';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';

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
}
