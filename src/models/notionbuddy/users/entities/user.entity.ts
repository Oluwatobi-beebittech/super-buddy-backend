import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity()
export class NotionBuddyUser extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  canvaUserId: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  canvaBrandId: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  canvaDesignId: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: true,
  })
  notionBotId: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: true,
  })
  notionAccessToken: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  notionOwner: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  notionWorkspaceIcon: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  notionWorkspaceName: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  notionWorkspaceId: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isNotionAccessTokenValid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
