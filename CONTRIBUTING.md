# Contributing Guide

First of all, thanks for all your efforts and contributions to this project! We appreciate your help in making Super Hash better.

In order to maintain a high-quality and a unified code, we have some guidelines for contributing to this project.

It may take up some time to review your contribution, thank you for your patience and understanding.

## General Guidelines

We only accept PRs and Issues in Chinese and English to ensure accuracy and minimize misunderstandings during language translation. Thank you for your understanding!

Of course, you can use any other language you are familiar with when communicating with other developers.

## PR Guidelines

If you want to contribute to Super Hash, you can submit a PR. Before submitting a PR, please check **if your contribution is duplicated with existing PRs**. If it is, **don't submit it again**. We still appreciate your efforts!

On the PR conception stage, please follow the following two requirements to ensure that your and my time is not wasted.

1. If your PR is about fixing a bug, please check if there is a related issue. If there is, you need to attach this issue in the PR, otherwise, please **create an issue first** for discussion. Make sure it is a bug and not an intentional feature to be implemented later.

2. If your PR is about a new feature, still check if there is a related issue. If not, please **create an issue first** for discussion to ensure feasibility. After confirming the necessity of the new feature, then submit the PR.

When submitting a PR, here are some tips:

1. To install dependencies, we use `pnpm` as the package manager. So run `pnpm install` in the project root directory. If you want to debug the tauri, you have to install the tauri prerequisites first, please refer to [Tauri prerequisites](https://tauri.app/start/prerequisites/), the soure code of the tauri is in the `src-tauri` directory.

2. After writing your code, please run `pnpm run format` first to format your code and run `pnpm run lint` to check for any linting errors. If there are any errors, **please fix them** before submitting your PR.

3. Run `pnpm run build:web` `pnpm run build:desktop` to build the project and make sure it can be built successfully. If the modification is related to Tauri, please run `pnpm tauri build` to check if it can be built successfully.

# 贡献指南

首先，感谢你为本项目所做的努力和贡献！我们非常感谢你为 Super Hash 做出的贡献。

为了保持一个高质量和统一的代码，我们需要在贡献时阅读以下指南。这可能会占用你的一些时间，感谢你的理解！

## 总指南

为了确保表意的精确性和尽可能减少在语言翻译过程中造成的误解，我们只接受来自中文和英语的PR和Issues。再次感谢你的理解！

当然，你可以在和其他开发者交流过程中使用其他任何你熟悉的语言。

## PR 提交指南

如果你希望为Super Hash提交代码做出贡献，你可以提交PR。在提交PR前，务必检查**你的PR有没有重复**。如果有，**请不要再次提交重复的PR**。我们依旧感谢你的付出！

在PR构思阶段，请遵循以下两个要求来保证你我的时间不被浪费。

1. 如果你的PR是关于改Bug的，请检查有没有关联的Issue。若有则需要在PR中附上这个issue，反之请**先提出一个Issue**进行商议。确认是bug而不是有意为之后再进行PR的实现。

2. 如果你的PR是关于新功能的，依旧先检查有没有关联的Issue。若没有请**先提出一个Issue**进行讨论以确保可行性。在确认新功能的必要性后再提交PR。

提交PR时有以下几点提示：

1. 安装依赖请使用 `pnpm`。我将它用作默认的包管理器。如果你只是希望修改前端的代码，只需在根目录下输入命令 `pnpm install` 即可。若需要修改调试与Tauri有关的代码，则需要相关软件，详情见 [Tauri 前置条件](https://tauri.app/start/prerequisites/)，相关代码存放在 `src-tauri` 文件夹。

2. 代码编写完成后，请务必执行 `pnpm run format` 来保证你的代码符合我们代码库的规范。同时也要执行 `pnpm run lint` 去确保你的代码里没有任何语法或样式错误。若有相关错误，请务必在提交PR前**修复它们**。

3. 最后一步，请运行 `pnpm run build:web` 和 `pnpm run build:desktop` 以确保构建可以顺利运行。如果修改包括了Tauri，请执行 `pnpm tauri build` 命令来确保Tauri也可以正常构建。
