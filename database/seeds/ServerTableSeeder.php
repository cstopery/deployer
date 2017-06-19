<?php

use Illuminate\Database\Seeder;
use REBELinBLUE\Deployer\Server;
use REBELinBLUE\Deployer\ServerTemplate;

class ServerTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('servers')->delete();

        foreach (ServerTemplate::all() as $template) {
            Server::create([
                'name'               => $template->name,
                'ip_address'         => $template->ip_address,
                'user'               => $template->user,
                'path'               => '/',
                'project_id'         => 1,
                'deploy_code'        => true,
                'server_template_id' => $template->id
            ]);
        }

        Server::create([
            'name'        => 'Database VM',
            'ip_address'  => '192.168.33.70',
            'user'        => 'deploy',
            'path'        => '/home/deploy',
            'project_id'  => 1,
            'deploy_code' => false,
        ]);
    }
}
