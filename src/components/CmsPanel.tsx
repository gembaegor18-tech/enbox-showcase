/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SiteContent, GeneratorModel } from '../types';
import {
  RotateCcw,
  BookOpen,
  X,
  Code,
  Copy,
  Check,
  CheckCircle,
  FileJson,
} from 'lucide-react';

interface CmsPanelProps {
  content: SiteContent;
  onUpdateContent: (newContent: SiteContent) => void;
  onResetContent: () => void;
  onClose: () => void;
}

export default function CmsPanel({
  content,
  onUpdateContent,
  onResetContent,
  onClose,
}: CmsPanelProps) {
  const [activeTab, setActiveTab] = useState<'hero' | 'generators' | 'company' | 'export' | 'guide'>('hero');
  const [selectedGeneratorIndex, setSelectedGeneratorIndex] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const handleHeroChange = (key: string, value: string) => {
    const updated = {
      ...content,
      hero: {
        ...content.hero,
        [key]: value,
      },
    };
    onUpdateContent(updated);
  };

  const handleCompanyChange = (key: string, value: string) => {
    const updated = {
      ...content,
      company: {
        ...content.company,
        [key]: value,
      },
    };
    onUpdateContent(updated);
  };

  const handleGeneratorChange = (index: number, key: keyof GeneratorModel | string, value: any) => {
    const updatedGenerators = [...content.generators];
    
    if (key.startsWith('specs.')) {
      const specField = key.split('.')[1];
      updatedGenerators[index] = {
        ...updatedGenerators[index],
        specs: {
          ...updatedGenerators[index].specs,
          [specField]: value,
        },
      };
    } else {
      updatedGenerators[index] = {
        ...updatedGenerators[index],
        [key]: value,
      };
    }

    const updated = {
      ...content,
      generators: updatedGenerators,
    };
    onUpdateContent(updated);
  };

  const generateTsCode = () => {
    return `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SiteContent } from './types';

export const DEFAULT_CONTENT: SiteContent = ${JSON.stringify(content, null, 2)};
`;
  };

  const copyToClipboard = (text: string, type: 'ts' | 'json') => {
    navigator.clipboard.writeText(text);
    if (type === 'ts') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все изменения к заводским настройкам?')) {
      onResetContent();
    }
  };

  return (
    <div id="cms-drawer" className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800 text-zinc-100 font-sans shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
          <h2 className="text-sm font-display font-semibold uppercase tracking-wider text-white">
            Система Управления Контентом (CMS)
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-white"
          title="Закрыть редактор"
        >
          <X size={18} />
        </button>
      </div>

      {/* Toggles */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/50 text-xs overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { id: 'hero', label: 'Главный экран' },
          { id: 'generators', label: 'Оборудование' },
          { id: 'company', label: 'О Мануфактуре' },
          { id: 'export', label: 'Экспорт кода' },
          { id: 'guide', label: 'Выгрузка на GitHub' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-amber-500 text-white bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Form Scroll View */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {activeTab === 'hero' && (
          <div className="space-y-4">
            <h3 className="text-zinc-400 text-xs font-mono uppercase tracking-wider">Раздел Hero</h3>
            <div>
              <label className="block text-xs text-zinc-400 mb-1 font-mono">Лента (Категория/Тег верх)</label>
              <input
                type="text"
                value={content.hero.eyebrow}
                onChange={(e) => handleHeroChange('eyebrow', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1 font-mono">Главный заголовок</label>
              <input
                type="text"
                value={content.hero.title}
                onChange={(e) => handleHeroChange('title', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1 font-mono">Подзаголовок / Описание</label>
              <textarea
                rows={3}
                value={content.hero.subtitle}
                onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1 font-mono">Надпись на кнопке</label>
              <input
                type="text"
                value={content.hero.ctaText}
                onChange={(e) => handleHeroChange('ctaText', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1 font-mono">Сноска под кнопкой</label>
              <input
                type="text"
                value={content.hero.ctaSubtext}
                onChange={(e) => handleHeroChange('ctaSubtext', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'generators' && (
          <div className="space-y-4">
            <h3 className="text-zinc-400 text-xs font-mono uppercase tracking-wider">Выбор решения</h3>
            <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-none">
              {content.generators.map((g, idx) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGeneratorIndex(idx)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    selectedGeneratorIndex === idx
                      ? 'bg-amber-500 text-white'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>

            {content.generators[selectedGeneratorIndex] && (
              <div className="space-y-4 pt-2 border-t border-zinc-800">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-mono">Название</label>
                    <input
                      type="text"
                      value={content.generators[selectedGeneratorIndex].name}
                      onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'name', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-mono">Категория</label>
                    <input
                      type="text"
                      value={content.generators[selectedGeneratorIndex].category}
                      onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'category', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-mono">Слоган / Девиз</label>
                  <input
                    type="text"
                    value={content.generators[selectedGeneratorIndex].slogan}
                    onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'slogan', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-mono">Цена</label>
                  <input
                    type="text"
                    value={content.generators[selectedGeneratorIndex].price}
                    onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'price', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-mono">Описание модели</label>
                  <textarea
                    rows={3}
                    value={content.generators[selectedGeneratorIndex].description}
                    onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'description', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Color Customizer */}
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-mono">Цвет корпуса бокса (RGB)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={content.generators[selectedGeneratorIndex].accentColor}
                      onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'accentColor', e.target.value)}
                      className="w-10 h-8 rounded bg-transparent border border-zinc-800 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={content.generators[selectedGeneratorIndex].accentColor}
                      onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'accentColor', e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Technical Specs Details */}
                <div className="pt-4 border-t border-zinc-800">
                  <h4 className="text-zinc-300 text-xs font-bold uppercase mb-2">Технические характеристики</h4>
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-0.5 font-mono">Мощность электросистемы</label>
                      <input
                        type="text"
                        value={content.generators[selectedGeneratorIndex].specs.capacity}
                        onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'specs.capacity', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-500 mb-0.5 font-mono">Тип двигателя</label>
                        <input
                          type="text"
                          value={content.generators[selectedGeneratorIndex].specs.engineType}
                          onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'specs.engineType', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-0.5 font-mono">Уровень шума</label>
                        <input
                          type="text"
                          value={content.generators[selectedGeneratorIndex].specs.noiseLevel}
                          onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'specs.noiseLevel', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-500 mb-0.5 font-mono">Расход топлива</label>
                        <input
                          type="text"
                          value={content.generators[selectedGeneratorIndex].specs.fuelConsumption}
                          onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'specs.fuelConsumption', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-0.5 font-mono">Габариты кожуха</label>
                        <input
                          type="text"
                          value={content.generators[selectedGeneratorIndex].specs.dimensions}
                          onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'specs.dimensions', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-500 mb-0.5 font-mono">Материал шкафа</label>
                        <input
                          type="text"
                          value={content.generators[selectedGeneratorIndex].specs.boxMaterial}
                          onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'specs.boxMaterial', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-0.5 font-mono">Общая масса</label>
                        <input
                          type="text"
                          value={content.generators[selectedGeneratorIndex].specs.weight}
                          onChange={(e) => handleGeneratorChange(selectedGeneratorIndex, 'specs.weight', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'company' && (
          <div className="space-y-4">
            <h3 className="text-zinc-400 text-xs font-mono uppercase tracking-wider">О компании</h3>
            <div>
              <label className="block text-xs text-zinc-400 mb-1 font-mono">Главный заголовок</label>
              <input
                type="text"
                value={content.company.title}
                onChange={(e) => handleCompanyChange('title', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1 font-mono">Подзаголовок</label>
              <input
                type="text"
                value={content.company.subtitle}
                onChange={(e) => handleCompanyChange('subtitle', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1 font-mono">Подробное описание производства</label>
              <textarea
                rows={4}
                value={content.company.description}
                onChange={(e) => handleCompanyChange('description', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs text-zinc-400 mb-1 font-mono">Важнейший рекорд</label>
                <input
                  type="text"
                  value={content.company.achievementYear}
                  onChange={(e) => handleCompanyChange('achievementYear', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-zinc-400 mb-1 font-mono">Описание рекорда</label>
                <input
                  type="text"
                  value={content.company.achievementText}
                  onChange={(e) => handleCompanyChange('achievementText', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-4">
            <h3 className="text-zinc-400 text-xs font-mono uppercase tracking-wider">Применить изменения</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Настроенный вами дизайн сейчас сохранен в локальной базе браузера (<strong>localStorage</strong>). Чтобы он отразился в живом коде приложения на <span className="text-amber-500 font-semibold text-xs">GitHub Pages</span> для внешних посетителей, выполните два простых шага:
            </p>

            <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <Code size={12} />
                  Код для src/data.ts
                </span>
                <button
                  onClick={() => copyToClipboard(generateTsCode(), 'ts')}
                  className="px-2.5 py-1 text-xs bg-zinc-800 text-zinc-200 hover:text-white rounded hover:bg-zinc-700 flex items-center gap-1.5 transition-all"
                >
                  {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copiedCode ? 'Скопировано!' : 'Копировать'}
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 leading-normal">
                Замените все содержимое файла <code className="text-white font-mono bg-zinc-900 px-1 py-0.5 rounded">src/data.ts</code> на этот сгенерированный код.
              </p>
            </div>

            <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1">
                  <FileJson size={12} />
                  Конфигурация в JSON
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(content, null, 2), 'json')}
                  className="px-2.5 py-1 text-xs bg-zinc-800 text-zinc-200 hover:text-white rounded hover:bg-zinc-700 flex items-center gap-1.5 transition-all"
                >
                  {copiedJson ? <Check size={12} className="text-cyan-400" /> : <Copy size={12} />}
                  {copiedJson ? 'Скопировано!' : 'Копировать'}
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 leading-normal">
                Резервная копия ваших настроек в формате JSON. Можно использовать для импорта или настроек в других сервисах.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-4">
            <h3 className="text-zinc-400 text-xs font-mono uppercase tracking-wider">Деплой на GitHub Pages</h3>
            <div className="bg-zinc-950 p-3.5 rounded border border-zinc-800 space-y-4 text-xs leading-relaxed text-zinc-300">
              <h4 className="font-semibold text-amber-400 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                <BookOpen size={14} />
                Пошаговая терминальная выгрузка с ПК
              </h4>
              
              <div className="space-y-3 text-zinc-400">
                <p>
                  Поскольку автоматический GitHub Actions может выдавать ошибки из-за отсутствия lock-файлов или версий Node, **терминальный способ является самым надежным, быстрым и профессиональным**. Нам понадобится всего 5 понятных шагов:
                </p>

                <div className="space-y-2">
                  <span className="text-zinc-200 font-bold block">1. Скачайте архив проекта</span>
                  <p className="pl-3">
                    В правом верхнем углу этой среды (на панели инструментов AI Studio "Settings") нажмите кнопку **Export** или скачайте весь проект в формате **ZIP** на свой компьютер, после чего распакуйте в любую удобную папку.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-zinc-200 font-bold block">2. Создайте пустой репозиторий на GitHub</span>
                  <p className="pl-3">
                    Перейдите на свою страницу <a href="https://github.com" target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">GitHub</a> и нажмите кнопку <strong>New</strong>. Дайте ему имя (например, <code className="text-white">genbox-showcase</code>). Главное: **НЕ ставьте галочки "Add a README" или "Add .gitignore"** (пусть репозиторий будет абсолютно пустым!).
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-zinc-200 font-bold block">3. Откройте папку в любом терминале / VS Code</span>
                  <p className="pl-3">
                    Откройте вашу разархивированную папку в терминале (командной строке ПК или в редакторе VS Code) и укажите адрес вашего репозитория:
                  </p>
                  <pre className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded font-mono text-[10px] ml-3 overflow-x-auto select-all">
                    git init{"\n"}
                    git remote add origin https://github.com/ВАШ_НИКНЕЙМ/genbox-showcase.git
                  </pre>
                </div>

                <div className="space-y-2">
                  <span className="text-zinc-200 font-bold block">4. Замените адрес homepage в package.json</span>
                  <p className="pl-3">
                    Откройте файл <code className="text-white">package.json</code> на ПК и в самом верху (после названия) пропишите строчку с адресом вашего будущего сайта:
                  </p>
                  <pre className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded font-mono text-[10px] ml-3">
                    "homepage": "https://ВАШ_НИКНЕЙМ.github.io/genbox-showcase",
                  </pre>
                </div>

                <div className="space-y-2">
                  <span className="text-emerald-400 font-bold block">5. Установите зависимости и запустите деплой одной командой!</span>
                  <p className="pl-3 text-zinc-300">
                    Мы уже установили и настроили для вас пакет <code className="text-white font-semibold">gh-pages</code>. Вам на компьютере нужно выполнить две команды:
                  </p>
                  <pre className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded font-mono text-[10px] ml-3 select-all">
                    npm install{"\n"}
                    npm run deploy
                  </pre>
                  <p className="pl-3 text-zinc-400 text-[10px]">
                    Эта команда автоматически соберет проект в папку <code className="text-white">dist</code>, создаст ветку <code className="text-white">gh-pages</code> на вашем GitHub и сама мгновенно выгрузит туда собранный сайт!
                  </p>
                </div>

                <div className="p-2 bg-zinc-950 border border-amber-500/10 rounded mt-4 text-[10px] leading-relaxed">
                  <span className="text-amber-400 font-bold block mb-1">💡 Как работает блокировка CMS на опубликованном сайте?</span>
                  Обычные пользователи будут видеть шикарный сайт-портфолио и кнопку «Оформить запрос» вместо удаления и редактирования. При переходе с параметром <code className="text-white">?admin=masterbox</code> или по клику 5 раз на логотип "GEN-BOX" у вас откроется окно ввода пароля, после чего вы снова сможете менять контент!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer sticky bar */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-between gap-2">
        <button
          onClick={handleReset}
          className="px-3 py-2 text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded transition-all flex items-center gap-1"
          title="Вернуть исходные данные"
        >
          <RotateCcw size={13} />
          Сбросить
        </button>

        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
        >
          <CheckCircle size={14} />
          Просмотр сайта
        </button>
      </div>
    </div>
  );
}
