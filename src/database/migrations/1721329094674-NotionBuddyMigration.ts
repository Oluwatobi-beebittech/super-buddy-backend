import { MigrationInterface, QueryRunner } from "typeorm";

export class NotionBuddyMigration1721329094674 implements MigrationInterface {
    name = 'NotionBuddyMigration1721329094674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notion_buddy_user\` (\`userId\` varchar(36) NOT NULL, \`canvaUserId\` varchar(50) NOT NULL, \`canvaBrandId\` varchar(50) NOT NULL, \`canvaDesignId\` varchar(50) NULL, \`notionBotId\` varchar(50) NULL, \`notionAccessToken\` varchar(50) NULL, \`notionOwner\` varchar(1000) NULL, \`notionWorkspaceIcon\` varchar(150) NULL, \`notionWorkspaceName\` varchar(150) NULL, \`notionWorkspaceId\` varchar(150) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_cb91f4b92a3acccfbcf5e5d210\` (\`canvaUserId\`), UNIQUE INDEX \`IDX_1f6d7f1982a5e7e7f3def10849\` (\`notionBotId\`), UNIQUE INDEX \`IDX_cf498efc9a3aa2d888830ace70\` (\`notionAccessToken\`), PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_cf498efc9a3aa2d888830ace70\` ON \`notion_buddy_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_1f6d7f1982a5e7e7f3def10849\` ON \`notion_buddy_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_cb91f4b92a3acccfbcf5e5d210\` ON \`notion_buddy_user\``);
        await queryRunner.query(`DROP TABLE \`notion_buddy_user\``);
    }

}
