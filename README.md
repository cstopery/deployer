# Deployer

[![StyleCI](https://styleci.io/repos/33559148/shield?style=flat-square&branch=master)](https://styleci.io/repos/33559148)
[![Build Status](https://img.shields.io/travis/REBELinBLUE/deployer/master.svg?style=flat-square&label=Travis+CI)](https://travis-ci.org/REBELinBLUE/deployer)
[![Code Coverage](https://img.shields.io/codecov/c/github/REBELinBLUE/deployer/master.svg?style=flat-square&label=Coverage)](https://codecov.io/gh/REBELinBLUE/deployer)


[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square&label=License)](/LICENSE.md)
[![Laravel Version](https://shield.with.social/cc/github/REBELinBLUE/deployer/master.svg?style=flat-square)](https://packagist.org/packages/laravel/framework)
[![Latest Version](https://img.shields.io/github/release/REBELinBLUE/deployer.svg?style=flat-square&label=Release)](https://github.com/REBELinBLUE/deployer/releases)
[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat-square&label=Tech)](https://stackshare.io/REBELinBLUE/deployer)
[![Gitter](https://img.shields.io/badge/chat-on%20gitter-brightgreen.svg?style=flat-square&label=Chat)](https://gitter.im/REBELinBLUE/deployer)

Deployer is a PHP Application deployment system powered by [Laravel 5.4](http://laravel.com), written & maintained by [Stephen Ball](https://github.com/REBELinBLUE).

Check out the [releases](https://github.com/REBELinBLUE/deployer/releases), [license](/LICENSE.md), [screenshots](https://github.com/REBELinBLUE/deployer/wiki/Screenshots) and [contribution guidelines](/.github/CONTRIBUTING.md).

See the [wiki](https://github.com/REBELinBLUE/deployer/wiki) for information on [system requirements](https://github.com/REBELinBLUE/deployer/wiki/system-requirements), [installation](https://github.com/REBELinBLUE/deployer/wiki/installation) & [upgrade](https://github.com/REBELinBLUE/deployer/wiki/upgrading) instructions and answers to [common questions](https://github.com/REBELinBLUE/deployer/wiki/common-issues).

## What it does

* Deploys applications to multiple servers accessible via SSH
* Clones your project's git repository
* Installs composer dependencies
* Runs arbitrary bash commands
* Gracefully handles failure in any of these steps
* Keeps a number of previous deployments
* Monitors that cronjobs are running
* Allows deployments to be triggered via a webhook

## What it doesn't do

* Provision VMs
* Install system packages
* Configure the web server, database or other services
* [Run a test suite or check code quality](http://phptesting.org)

## License

Deployer is licensed under [The MIT License (MIT)](/LICENSE.md).


1、简介
Deployer是一个基于Laravel 5.1的、免费的、开源的PHP应用部署工具。由Stephen Ball编写和维护。

2、GitHub
https://github.com/REBELinBLUE/deployer

3、功能特性
通过SSH部署应用方到多台服务器
克隆项目git仓库
安装composer依赖
运行任意bash命令
优雅地处理上述步骤出现的错误
保持之前的部署
监控cronjob的运行
允许通过webhook触发部署
4、生产环境中使用
本项目GitHub仓库代码的master分支是开发分支，不能用于实际生产环境，当稳定后代码修改会合并到release分支并被打上发布标签。推荐在生产环境中使用最新的release分支。

5、系统要求
安装运行Deployer需要系统具备以下条件：

PHP 5.5.9+
数据库，推荐MySQL或PostgreSQL
Composer
Redis
Node.js
适用于Laravel的队列系统，推荐Beanstalkd，不过Redis也可以
可选项

Supervisor用于监听队列和Node.js套接字服务器的运行
如果有大量的并发需要一台缓存服务器，否则默认的文件缓存就足够了
6、安装
克隆仓库

$ git clone https://github.com/REBELinBLUE/deployer.git
拉出最新版本

$ git checkout 0.0.21
安装依赖

$ composer install -o --no-dev
$ npm install --production
运行安装器

$ php artisan app:install
编辑额外配置（可选）

$ editor .env
7、更新
获取最新代码

$ git fetch --all
$ git checkout 0.0.21
更新依赖

$ composer install -o --no-dev
$ npm install --production
运行更新

$ php artisan app:update

