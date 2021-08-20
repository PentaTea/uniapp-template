import paragraphIcon from '../../assets/pngicon/paragraph/2.png'
import htmlIcon from '../../assets/pngicon/html/2.png'
import hrIcon from '../../assets/pngicon/horizontal_line/2.png'
import frontMatterIcon from '../../assets/pngicon/front_matter/2.png'
import header1Icon from '../../assets/pngicon/heading_1/2.png'
import header2Icon from '../../assets/pngicon/heading_2/2.png'
import header3Icon from '../../assets/pngicon/heading_3/2.png'
import header4Icon from '../../assets/pngicon/heading_4/2.png'
import header5Icon from '../../assets/pngicon/heading_5/2.png'
import header6Icon from '../../assets/pngicon/heading_6/2.png'
import newTableIcon from '../../assets/pngicon/new_table/2.png'
import bulletListIcon from '../../assets/pngicon/bullet_list/2.png'
import codeIcon from '../../assets/pngicon/code/2.png'
import quoteIcon from '../../assets/pngicon/quote_block/2.png'
import todoListIcon from '../../assets/pngicon/todolist/2.png'
import mathblockIcon from '../../assets/pngicon/math/2.png'
import orderListIcon from '../../assets/pngicon/order_list/2.png'
import flowchartIcon from '../../assets/pngicon/flowchart/2.png'
import sequenceIcon from '../../assets/pngicon/sequence/2.png'
import mermaidIcon from '../../assets/pngicon/mermaid/2.png'
import vegaIcon from '../../assets/pngicon/chart/2.png'
import { isOsx } from '../../config'

const COMMAND_KEY = isOsx ? '⌘' : 'Ctrl'
const OPTION_KEY = isOsx ? '⌥' : 'Alt'
const SHIFT_KEY = isOsx ? '⇧' : 'Shift'

// Command (or Cmd) ⌘
// Shift ⇧
// Option (or Alt) ⌥
// Control (or Ctrl) ⌃
// Caps Lock ⇪
// Fn

export const quickInsertObj = {
  基础元素: [
    {
      title: '正文',
      subTitle: 'Lorem Ipsum is simply dummy text',
      label: 'paragraph',
      shortCut: `${COMMAND_KEY}+0`,
      icon: paragraphIcon,
    },
    {
      title: '分割线',
      subTitle: '---',
      label: 'hr',
      shortCut: `${OPTION_KEY}+${COMMAND_KEY}+-`,
      icon: hrIcon,
    },
    {
      title: '文章信息',
      subTitle: '--- Lorem Ipsum ---',
      label: 'front-matter',
      shortCut: `${OPTION_KEY}+${COMMAND_KEY}+Y`,
      icon: frontMatterIcon,
    },
  ],
  标题: [
    {
      title: '一级标题',
      subTitle: '# Lorem Ipsum is simply ...',
      label: 'heading 1',
      shortCut: `${COMMAND_KEY}+1`,
      icon: header1Icon,
    },
    {
      title: '二级标题',
      subTitle: '## Lorem Ipsum is simply ...',
      label: 'heading 2',
      shortCut: `${COMMAND_KEY}+2`,
      icon: header2Icon,
    },
    {
      title: '三级标题',
      subTitle: '### Lorem Ipsum is simply ...',
      label: 'heading 3',
      shortCut: `${COMMAND_KEY}+3`,
      icon: header3Icon,
    },
    {
      title: '四级标题',
      subTitle: '#### Lorem Ipsum is simply ...',
      label: 'heading 4',
      shortCut: `${COMMAND_KEY}+4`,
      icon: header4Icon,
    },
    {
      title: '五级标题',
      subTitle: '##### Lorem Ipsum is simply ...',
      label: 'heading 5',
      shortCut: `${COMMAND_KEY}+5`,
      icon: header5Icon,
    },
    {
      title: '六级标题',
      subTitle: '###### Lorem Ipsum is simply ...',
      label: 'heading 6',
      shortCut: `${COMMAND_KEY}+6`,
      icon: header6Icon,
    },
  ],
  列表: [
    {
      title: '有序列表',
      subTitle: '1. Lorem Ipsum is simply ...',
      label: 'ol-order',
      shortCut: `${OPTION_KEY}+${COMMAND_KEY}+O`,
      icon: orderListIcon,
    },
    {
      title: '无序列表',
      subTitle: '- Lorem Ipsum is simply ...',
      label: 'ul-bullet',
      shortCut: `${OPTION_KEY}+${COMMAND_KEY}+U`,
      icon: bulletListIcon,
    },
    {
      title: '复选框',
      subTitle: '- [x] Lorem Ipsum is simply ...',
      label: 'ul-task',
      shortCut: `${OPTION_KEY}+${COMMAND_KEY}+X`,
      icon: todoListIcon,
    },
  ],
  块级元素: [
    {
      title: '引用',
      subTitle: '>Lorem Ipsum is simply ...',
      label: 'blockquote',
      shortCut: `${OPTION_KEY}+${COMMAND_KEY}+Q`,
      icon: quoteIcon,
    },
    {
      title: '表格',
      subTitle: '|Lorem | Ipsum is simply |',
      label: 'table',
      shortCut: `${SHIFT_KEY}+${COMMAND_KEY}+T`,
      icon: newTableIcon,
    },
    {
      title: '代码块',
      subTitle: '```java Lorem Ipsum is simply ```',
      label: 'pre',
      shortCut: `${OPTION_KEY}+${COMMAND_KEY}+C`,
      icon: codeIcon,
    },
    {
      title: '公式',
      subTitle: '$$ Lorem Ipsum is simply $$',
      label: 'mathblock',
      shortCut: `${OPTION_KEY}+${COMMAND_KEY}+M`,
      icon: mathblockIcon,
    },
    {
      title: 'HTML',
      subTitle: '<div> Lorem Ipsum is simply </div>',
      label: 'html',
      shortCut: `${OPTION_KEY}+${COMMAND_KEY}+J`,
      icon: htmlIcon,
    },
  ],
  图表: [
    // {
    //   title: 'Vega Chart',
    //   subTitle: 'Render flow chart by vega-lite.js.',
    //   label: 'vega-lite',
    //   icon: vegaIcon,
    // },
    {
      title: 'Flow Chart',
      subTitle: 'Render flow chart by flowchart.js.',
      label: 'flowchart',
      icon: flowchartIcon,
    },
    {
      title: 'Sequence Diagram',
      subTitle: 'Render sequence diagram by js-sequence.',
      label: 'sequence',
      icon: sequenceIcon,
    },
    {
      title: 'Mermaid',
      subTitle: 'Render Diagram by mermaid.',
      label: 'mermaid',
      icon: mermaidIcon,
    },
  ],
}
