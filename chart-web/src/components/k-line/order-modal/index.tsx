import { Modal, Table } from '@nbit/arco'
import { timeLocaleLanguageMap, MarkersType } from '@nbit/chart-utils'
import React from 'react'

interface OrderModalType {
  modalVisible: boolean
  setModalVisible: (v) => void
  tableData: Array<MarkersType>
  locale: string
}

/** 订单 modal */
function OrderPop(props: OrderModalType) {
  const { modalVisible, setModalVisible, tableData, locale } = props

  const columns = [
    {
      title: timeLocaleLanguageMap[locale][`时间`],
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: timeLocaleLanguageMap[locale][`数量`],
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: timeLocaleLanguageMap[locale][`价格`],
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: timeLocaleLanguageMap[locale][`手续费`],
      dataIndex: 'fees',
      key: 'fees',
    },
  ]

  return (
    <Modal
      title={timeLocaleLanguageMap[locale][`订单详情`]}
      visible={modalVisible}
      footer={null}
      className="chart-order-pop"
      onOk={() => setModalVisible(false)}
      onCancel={() => setModalVisible(false)}
    >
      <Table
        rowKey={record => record.id}
        className="chart-order-table"
        border={false}
        pagination={false}
        columns={columns}
        data={tableData}
      />
    </Modal>
  )
}

export default OrderPop
