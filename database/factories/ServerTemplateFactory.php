<?php

use Faker\Generator;
use REBELinBLUE\Deployer\ServerTemplate;

/* @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(ServerTemplate::class, function (Generator $faker) {
    return [
        'name'       => $faker->words,
        'user'       => $faker->userName,
        'ip_address' => $faker->ipv4,
        'port'       => 22,
        'path'       => '/var/www',
    ];
});
