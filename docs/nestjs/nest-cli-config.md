---
title: nest-cli.json翻译版
date: 2023-11-14
sidebar: 'auto'
tags:
 - nestjs
categories:
 - nestjs
---

```json
{
  "$comment": "https://docs.nestjs.com/cli/monorepo#cli-properties",
  "$id": "https://json.schemastore.org/nest-cli.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "CompilerOptions": {
      "type": "object",
      "description": "一个映射，包含编译器选项的键和相应的选项设置。详细信息请参见 https://docs.nestjs.com/cli/monorepo#global-compiler-options",
      "$comment": "https://docs.nestjs.com/cli/monorepo#global-compiler-options",
      "default": {},
      "properties": {
        "tsConfigPath": {
          "default": "tsconfig.build.json",
          "type": "string",
          "description": "(仅适用于 monorepo) 指向包含 tsconfig.json 设置的文件的路径。当调用 nest build 或 nest start 时没有提供项目选项时使用（例如，在构建或启动默认项目时）。如果没有此文件，'nest build' 将无法按预期工作。",
          "$comment": "https://github.com/nestjs/nest-cli/blob/master/lib/compiler/defaults/webpac-defaults.ts"
        },
        "builder": {
          "anyOf": [
            {
              "default": "tsc",
              "type": "string",
              "enum": ["tsc", "webpack", "swc"],
              "description": "要使用的构建工具（tsc、webpack、swc）。有关如何配置 `SWC` 的详细信息，请参见 https://docs.nestjs.com/recipes/swc#getting-started",
              "$comment": "https://github.com/nestjs/nest-cli/blob/master/commands/build.command.ts"
            },
            {
              "type": "object",
              "properties": {
                "type": {
                  "default": "tsc",
                  "type": "string",
                  "enum": ["tsc", "webpack", "swc"],
                  "description": "要使用的构建工具（tsc、webpack、swc）。有关如何配置 `SWC` 的详细信息，请参见 https://docs.nestjs.com/recipes/swc#getting-started",
                  "$comment": "https://github.com/nestjs/nest-cli/blob/master/commands/build.command.ts"
                },
                "options": {
                  "type": "object",
                  "properties": {
                    "outDir": {
                      "type": "string",
                      "description": "输出文件的目录。"
                    },
                    "filenames": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "description": "要包含的文件名数组。"
                    },
                    "sync": {
                      "type": "boolean",
                      "description": "是否同步文件。"
                    },
                    "extensions": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "description": "要考虑的文件扩展名数组。"
                    },
                    "copyFiles": {
                      "type": "boolean",
                      "description": "是否复制文件。"
                    },
                    "includeDotfiles": {
                      "type": "boolean",
                      "description": "是否包括点文件。"
                    },
                    "quiet": {
                      "type": "boolean",
                      "description": "是否抑制日志。"
                    },
                    "watch": {
                      "type": "boolean",
                      "description": "是否监视文件变化。"
                    }
                  }
                }
              }
            }
          ]
        },
        "typeCheck": {
          "default": false,
          "type": "boolean",
          "description": "如果为 true，则启用类型检查（当使用 SWC 时）。详细信息请参见 https://docs.nestjs.com/recipes/swc#type-checking。",
          "$comment": "https://github.com/nestjs/nest-cli/blob/master/commands/build.command.ts"
        },
        "webpack": {
          "default": false,
          "type": "boolean",
          "description": "如果为 true，则使用 webpack 编译器（不推荐使用，改用 `builder`）。如果为 false 或未提供，则使用 tsc。在 monorepo 模式下，默认为 true（使用 webpack），在标准模式下，默认为 false（使用 tsc）。详细信息请参见 https://docs.nestjs.com/cli/monorepo#cli-properties",
          "$comment": "https://github.com/nestjs/nest-cli/blob/master/commands/build.command.ts"
        },
        "webpackConfigPath": {
          "default": "webpack.config.js",
          "type": "string",
          "description": "指向 webpack 选项文件的路径。如果未指定，Nest 将查找文件 webpack.config.js。",
          "$comment": "https://github.com/nestjs/nest-cli/blob/master/commands/build.command.ts"
        },
        "plugins": {
          "default": [],
          "$comment": "https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin",
          "type": "array",
          "items": {
            "$ref": "#/definitions/PluginItems"
          }
        },
        "assets": {
          "default": [],
          "type": "array",
          "items": {
            "$ref": "#/definitions/AssetsOptions"
          },
          "description": "在每次编译步骤开始时，启用自动分发非 TypeScript 资源。在增量编译中，不会进行资源分发（在 --watch 模式下不会发生）。接受类似 glob 的字符串和对象。详情请参见 https://docs.nestjs.com/cli/monorepo#assets",
          "$comment": "https://docs.nestjs.com/cli/monorepo#assets"
        },
        "watchAssets": {
          "default": false,
          "type": "boolean",
          "description": "如果为 true，在 watch 模式下运行，监视所有非 TypeScript 资源。在 assets 属性中设置 watchAssets 会覆盖 assets 属性内的任何 watchAssets 设置。",
          "$comment": "https://github.com/nestjs/nest-cli/blob/master/commands/build.command.ts"
        },
        "deleteOutDir": {
          "type": "boolean",
          "default": false,
          "description": "如果为 true，在每次调用编译器时，都会首先删除编译输出目录（如在 tsconfig.json 中配置的）。"
        },
        "manualRestart": {
          "type": "boolean",
          "default": false,
          "description": "如果为 true，则启用快捷键 `rs` 以手动重新启动服务器。"
        }
      },
      "additionalProperties": false
    },
    "AssetsOptions": {
      "type": ["string", "object"],
      "$comment": "https://docs.nestjs.com/cli/monorepo#assets",
      "description": "为了更精细地控制，元素可以是对象。",
      "properties": {
        "include": {
          "type": "string",
          "description": "用于分发的类似 glob 的文件规范。"
        },
        "exclude": {
          "type": "string",
          "description": "从 include 列表中排除的类似 glob 的文件规范。"
        },
        "outDir": {
          "type": "string",
          "description": "指定资产应分发的路径（相对于根文件夹）。默认为配置为编译器输出的相同输出目录。"
        },
        "watchAssets": {
          "type": "boolean",
          "description": "如果为 true，在 watch 模式下运行，监视指定的资产。在 top-level compilerOptions 属性中设置 watchAssets 会覆盖 assets 属性内的任何 watchAssets 设置。"
        }
      },
      "additionalProperties": false
    },
    "GenerateOptions": {
      "type": "object",
      "description": "包含全局生成选项的映射，其中键指定全局生成选项，值指定选项设置。详细信息请参见 https://docs.nestjs.com/cli/monorepo#global-generate-options",
      "$comment": "https://docs.nestjs.com/cli/monorepo#global-generate-options",
      "properties": {
        "spec": {
          "$ref": "#/definitions/GenerateSpecOptions"
        },
        "flat": {
          "$ref": "#/definitions/GenerateFlatOptions"
        },
        "baseDir": {
          "$ref": "#/definitions/GenerateBaseDirOptions"
        }
      },
      "default": {},
      "additionalProperties": false
    },
    "GenerateFlatOptions": {
      "type": "boolean",
      "default": false,
      "description": "如果为 true，则所有生成命令都将生成一个扁平结构。",
      "$comment": "https://docs.nestjs.com/cli/monorepo#global-generate-options"
    },
    "GenerateSpecOptions": {
      "type": ["boolean", "object"],
      "description": "如果值为布尔值，则 true 值默认情况下启用默认生成规范，false 禁用它。在 CLI 命令行上传递的标志会覆盖此设置，项目特定的 generateOptions 设置也会覆盖此设置。如果值为对象，则每个键表示一个原理名，布尔值确定是否为该特定原理启用/禁用默认规范生成。详细信息请参见 https://docs.nestjs.com/cli/monorepo#global-generate-options",
      "$comment": "https://docs.nestjs.com/cli/monorepo#global-generate-options",
      "properties": {
                "application": {
          "type": "boolean",
          "description": "是否为应用原理生成规范文件。"
        },
        "class": {
          "type": "boolean",
          "description": "禁用类原理的规范文件生成。"
        },
        "cl": {
          "type": "boolean",
          "description": "类的别名。"
        },
        "configuration": {
          "type": "boolean",
          "description": "是否为配置原理生成规范文件。"
        },
        "config": {
          "type": "boolean",
          "description": "配置的别名。"
        },
        "controller": {
          "type": "boolean",
          "description": "是否为控制器原理生成规范文件。"
        },
        "co": {
          "type": "boolean",
          "description": "控制器的别名。"
        },
        "decorator": {
          "type": "boolean",
          "description": "是否为装饰器原理生成规范文件。"
        },
        "d": {
          "type": "boolean",
          "description": "装饰器的别名。"
        },
        "filter": {
          "type": "boolean",
          "description": "是否为过滤器原理生成规范文件。"
        },
        "f": {
          "type": "boolean",
          "description": "过滤器的别名。"
        },
        "gateway": {
          "type": "boolean",
          "description": "是否为网关原理生成规范文件。"
        },
        "ga": {
          "type": "boolean",
          "description": "网关的别名。"
        },
        "guard": {
          "type": "boolean",
          "description": "是否为守卫原理生成规范文件。"
        },
        "gu": {
          "type": "boolean",
          "description": "守卫的别名。"
        },
        "interceptor": {
          "type": "boolean",
          "description": "是否为拦截器原理生成规范文件。"
        },
        "in": {
          "type": "boolean",
          "description": "拦截器的别名。"
        },
        "interface": {
          "type": "boolean",
          "description": "是否为接口原理生成规范文件。"
        },
        "middleware": {
          "type": "boolean",
          "description": "是否为中间件原理生成规范文件。"
        },
        "mi": {
          "type": "boolean",
          "description": "中间件的别名。"
        },
        "module": {
          "type": "boolean",
          "description": "是否为模块原理生成规范文件。"
        },
        "mo": {
          "type": "boolean",
          "description": "模块的别名。"
        },
        "pipe": {
          "type": "boolean",
          "description": "是否为管道原理生成规范文件。"
        },
        "pi": {
          "type": "boolean",
          "description": "管道的别名。"
        },
        "provider": {
          "type": "boolean",
          "description": "是否为提供者原理生成规范文件。"
        },
        "pr": {
          "type": "boolean",
          "description": "提供者的别名。"
        },
        "resolver": {
          "type": "boolean",
          "description": "是否为解析器原理生成规范文件。"
        },
        "r": {
          "type": "boolean",
          "description": "解析器的别名。"
        },
        "service": {
          "type": "boolean",
          "description": "是否为服务原理生成规范文件。"
        },
        "s": {
          "type": "boolean",
          "description": "服务的别名。"
        },
        "library": {
          "type": "boolean",
          "description": "是否为库原理生成规范文件。"
        },
        "lib": {
          "type": "boolean",
          "description": "库的别名。"
        },
        "sub-app": {
          "type": "boolean",
          "description": "是否为子应用原理生成规范文件。"
        },
        "app": {
          "type": "boolean",
          "description": "子应用的别名。"
        },
        "resource": {
          "type": "boolean",
          "description": "是否为资源原理生成规范文件。"
        },
        "res": {
          "type": "boolean",
          "description": "资源的别名。"
        }
      },
      "additionalProperties": false
    },
    "GenerateBaseDirOptions": {
      "type": "string",
      "default": "",
      "description": "基础目录"
    },
    "ProjectConfiguration": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string"
        },
        "root": {
          "type": "string"
        },
        "entryFile": {
          "type": "string"
        },
        "sourceRoot": {
          "type": "string"
        },
        "compilerOptions": {
          "$ref": "#/definitions/CompilerOptions"
        },
        "generateOptions": {
          "$ref": "#/definitions/GenerateOptions"
        }
      },
      "additionalProperties": false
    },
    "PluginItems": {
      "$comment": "https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin",
      "type": ["string", "object"],
      "properties": {
        "name": {
          "type": "string",
          "description": "cli 插件的 npm 包名称，例如 @nestjs/swagger。"
        },
        "options": {
          "anyOf": [
            {
              "$ref": "#/definitions/PluginOptions"
            },
            {
              "$ref": "#/definitions/GraphQLPluginOptions"
            },
            {
              "$ref": "#/definitions/SwaggerPluginOptions"
            }
          ]
        }
      }
    },
    "PluginOptions": {
      "type": "object",
      "properties": {
        "introspectComments": {
          "type": "boolean",
          "default": true,
          "description": "如果设置为 true，插件将根据注释为属性生成描述和示例值。"
        }
      }
    },
    "GraphQLPluginOptions": {
      "type": "object",
      "$comment": "https://docs.nestjs.com/graphql/cli-plugin#using-the-cli-plugin",
      "properties": {
        "typeFileNameSuffix": {
          "type": "array",
          "default": [".input.ts", ".args.ts", ".entity.ts", ".model.ts"],
          "description": "(仅限 GraphQL) GraphQL 类型文件后缀。默认值：['.input.ts', '.args.ts', '.entity.ts', '.model.ts']。详情请参见 https://docs.nestjs.com/graphql/cli-plugin#using-the-cli-plugin"
        }
      }
    },
    "SwaggerPluginOptions": {
      "type": "object",
      "$comment": "https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin",
      "properties": {
        "dtoFileNameSuffix": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": [".dto.ts", ".entity.ts"],
          "description": "(仅限 Swagger) DTO（数据传输对象）文件后缀。默认值：['.dto.ts', '.entity.ts']。详情请参见 https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin"
        },
        "controllerFileNameSuffix": {
          "type": "string",
          "default": ".controller.ts",
          "description": "(仅限 Swagger) 控制器文件后缀。详情请参见 https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin"
        },
        "classValidatorShim": {
          "type": "boolean",
          "default": true,
          "description": "(仅限 Swagger) 如果设置为 true，模块将重用 class-validator 验证装饰器（例如 @Max(10) 将在模式定义中添加 max: 10）。详情请参见 https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin"
        },
        "dtoKeyOfComment": {
          "type": "string",
          "default": "description",
          "description": "(仅限 Swagger) 用于在 ApiProperty 上设置注释文本的属性键。详情请参见 https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin"
        },
        "controllerKeyOfComment": {
          "type": "string",
          "default": "description",
          "description": "(仅限 Swagger) 用于在 ApiOperation 上设置注释文本的属性键。详情请参见 https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin"
        }
      }
    }
  },
  "properties": {
    "language": {
      "type": "string",
      "default": "ts",
      "description": "编程语言。"
    },
    "collection": {
      "type": "string",
      "default": "@nestjs/schematics",
      "description": "指向用于生成组件的原理集合。通常情况下，您不应更改此值。"
    },
    "sourceRoot": {
      "type": "string",
      "default": "src",
      "description": "指向标准模式结构中单个项目的源代码根目录，或在 monorepo 模式结构中指向默认项目的根目录。"
    },
    "entryFile": {
      "type": "string",
      "default": "main",
      "description": "‘nest start’ 起作用的入口文件。默认为 'main'。"
    },
    "monorepo": {
      "type": "boolean",
      "description": "(仅限 monorepo) 对于 monorepo 模式结构，此值始终为 true。"
    },
    "root": {
      "type": "string",
      "description": "(仅限 monorepo) 指向默认项目的项目根目录。"
    },
    "compilerOptions": {
      "$ref": "#/definitions/CompilerOptions",
      "description": "编译器选项。"
    },
    "generateOptions": {
      "$ref": "#/definitions/GenerateOptions",
      "description": "生成选项。"
    },
    "projects": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/definitions/ProjectConfiguration"
      },
      "default": {},
      "description": "项目配置。"
    }
  },
  "title": "Nest CLI 配置",
  "type": "object"
}
```
