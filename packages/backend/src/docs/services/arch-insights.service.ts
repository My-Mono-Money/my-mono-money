import { INestApplication, Injectable } from '@nestjs/common';
import {
  SpelunkerModule,
  SpelunkedNode,
  SpelunkedEdge,
} from 'nestjs-spelunker';

const blackListModules = [
  'TypeOrmModule',
  'ConfigModule',
  'ConfigHostModule',
  'TypeOrmCoreModule',
  'AXIOS_INSTANCE_TOKEN',
  'JWT_MODULE_OPTIONS',
  // TODO: investigate better solutions for it
  'BullModule',
  'DiscoveryModule',
];

@Injectable()
export class ArchInsightsService {
  private app: INestApplication;

  setApp(app: INestApplication) {
    this.app = app;
  }

  getArchDiagram() {
    const tree = SpelunkerModule.explore(this.app);
    const root = SpelunkerModule.graph(tree);
    const edges = SpelunkerModule.findGraphEdges(root);
    const allNodes = [
      ...new Set(edges.map(({ from, to }) => [from, to]).flat(1)),
    ];

    return (
      'graph TD\n' +
      [
        this.getModule2ModuleEdges(edges),
        this.getModule2ServiceEdges(allNodes),
        this.getModule2ControllerEdges(allNodes),
      ]
        .flat(1)
        .filter(
          (item) =>
            !blackListModules.includes(item.from) &&
            !blackListModules.includes(item.to),
        )
        .map(({ from, to, link }) => ['    ', from, link, to].join(''))
        .join('\n')
    );
  }

  getModule2ModuleEdges(edges: SpelunkedEdge[]) {
    return edges.map(({ from, to }) => ({
      from: from.module.name,
      to: to.module.name,
      link: '----->',
    }));
  }

  getModule2ServiceEdges(nodes: SpelunkedNode[]) {
    return nodes
      .map((moduleItem) => {
        return Object.keys(moduleItem.module.providers).map((providerItem) => ({
          from: moduleItem.module.name,
          to: providerItem,
          link: '---->',
        }));
      })
      .flat(1);
  }

  getModule2ControllerEdges(nodes: SpelunkedNode[]) {
    return nodes
      .map((moduleItem) => {
        return moduleItem.module.controllers.map((controllerItem) => ({
          from: moduleItem.module.name,
          to: controllerItem,
          link: '--->',
        }));
      })
      .flat(1);
  }
}
