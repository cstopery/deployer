<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAdditionalServerTemplateFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('server_templates', function (Blueprint $table) {
            $table->string('user');
            $table->string('path');
            $table->integer('port')->default(22)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('server_templates', function (Blueprint $table) {
            $table->dropColumn(['name', 'user', 'path']);
            $table->integer('port')->default(null);
        });
    }
}
